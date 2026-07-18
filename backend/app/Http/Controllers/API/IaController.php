<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\IaMensaje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IaController extends Controller
{
    /**
     * Return the conversation history for the authenticated user.
     */
    public function getHistory(Request $request)
    {
        $userId = $request->user()->id;

        $mensajes = IaMensaje::where('user_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get(['role', 'content', 'created_at']);

        return response()->json($mensajes);
    }

    /**
     * Send a user message and get an AI reply.
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'meals' => 'nullable|array',
        ]);

        $user = $request->user();
        $userId = $user->id;

        // Read API key – try both env() and config() to ensure it's loaded
        $apiKey = env('GEMINI_API_KEY');
        if (empty($apiKey)) {
            // Fallback: read directly from .env file
            $envPath = base_path('.env');
            if (file_exists($envPath)) {
                foreach (file($envPath) as $line) {
                    if (str_starts_with(trim($line), 'GEMINI_API_KEY=')) {
                        $apiKey = trim(str_replace('GEMINI_API_KEY=', '', $line));
                        break;
                    }
                }
            }
        }

        if (empty($apiKey)) {
            return response()->json(['error' => 'Clave de API de IA no configurada en el servidor.'], 500);
        }

        // Fetch active routine and format it as text context
        $routineText = "El usuario no tiene una rutina activa registrada de entrenamiento en el sistema.";
        try {
            $rutina = \App\Models\Rutina::where('user_id', $userId)
                ->where('activa', true)
                ->orderBy('created_at', 'desc')
                ->first();
            if ($rutina && isset($rutina->plan_semanal['dias'])) {
                $routineText = "Rutina activa del usuario:\n";
                foreach ($rutina->plan_semanal['dias'] as $dia) {
                    $routineText .= "- " . ($dia['dia'] ?? 'Día') . " (Grupo muscular: " . ($dia['grupo_muscular'] ?? 'Varios') . "): ";
                    $ejList = [];
                    if (isset($dia['ejercicios']) && is_array($dia['ejercicios'])) {
                        foreach ($dia['ejercicios'] as $ej) {
                            $ejList[] = ($ej['nombre'] ?? 'Ejercicio') . " (" . ($ej['series'] ?? 3) . "x" . ($ej['repeticiones'] ?? 10) . ")";
                        }
                    }
                    $routineText .= implode(', ', $ejList) . "\n";
                }
            }
        } catch (\Exception $e) {
            Log::warning('Could not fetch active routine for AI context', ['error' => $e->getMessage()]);
        }

        // Format daily meals content
        $mealsText = "El usuario no ha registrado ninguna comida el día de hoy.";
        if ($request->has('meals') && is_array($request->meals)) {
            $mealsText = "Comidas de hoy (con estado de consumo):\n";
            foreach ($request->meals as $meal) {
                $estado = ($meal['done'] ?? false) ? 'Completado / Consumido' : 'Pendiente / No consumido';
                $mealsText .= "- " . ($meal['name'] ?? 'Comida') . " a las " . ($meal['time'] ?? '--:--')
                    . ": " . ($meal['kcal'] ?? 0) . " kcal (Proteínas: " . ($meal['p'] ?? 0) . "g, Carbohidratos: "
                    . ($meal['c'] ?? 0) . "g, Grasas: " . ($meal['g'] ?? 0) . "g) -> Estado: " . $estado . "\n";
            }
        }

        // Save the user message
        IaMensaje::create([
            'user_id' => $userId,
            'role' => 'user',
            'content' => $request->message,
        ]);

        // Build the conversation context (last 20 messages)
        $history = IaMensaje::where('user_id', $userId)
            ->orderBy('created_at', 'asc')
            ->limit(20)
            ->get();

        // Build Gemini-compatible contents array
        $contents = [];

        $systemPrompt = "Eres FitBot, un asistente de fitness personal especializado de GymTrack. " .
            "Ayudas a los usuarios con rutinas de entrenamiento, nutrición, dietas, técnicas de ejercicio y hábitos saludables. " .
            "Siempre respondes en español de forma amigable, motivadora y profesional. " .
            "Tus respuestas son concretas, prácticas y adaptadas al usuario. " .
            "El usuario se llama: {$user->nombre}.\n\n" .
            "--- INFORMACIÓN EN TIEMPO REAL SOBRE EL USUARIO ---\n" .
            $routineText . "\n" .
            $mealsText . "\n\n" .
            "Importante: Si el usuario te hace preguntas que implican saber su rutina o lo que ha comido hoy (ej. '¿qué opinas de mi rutina?', '¿cómo voy con mi alimentación hoy?', etc.), utiliza única y detalladamente los datos de arriba para responder de forma concisa y amigable.\n\n" .
            "REGLA DE FORMATO OBLIGATORIA: Responde SIEMPRE en texto plano y natural, como si fueras una persona hablando. NUNCA uses simbolos Markdown: sin asteriscos (*), sin almohadillas (#), sin guiones bajos (_), sin comillas invertidas (`). Usa saltos de linea simples para separar ideas si es necesario, pero sin listas con simbolos.";

        $contents[] = ['role' => 'user', 'parts' => [['text' => $systemPrompt]]];
        $contents[] = ['role' => 'model', 'parts' => [['text' => "¡Entendido! Soy FitBot, tu asistente de fitness personal. ¿En qué puedo ayudarte?"]]];

        foreach ($history as $msg) {
            $contents[] = [
                'role' => $msg->role,
                'parts' => [['text' => $msg->content]],
            ];
        }

        try {
            $response = Http::timeout(30)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={$apiKey}",
                ['contents' => $contents]
            );

            if (!$response->successful()) {
                $errBody = $response->json();
                Log::error('Gemini API error', ['status' => $response->status(), 'body' => $errBody]);
                $errMsg = $errBody['error']['message'] ?? 'Error desconocido de la API de IA.';
                return response()->json(['error' => "Error de IA: {$errMsg}"], 500);
            }

            $data = $response->json();
            $aiReply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'No pude generar una respuesta.';

        } catch (\Exception $e) {
            Log::error('Gemini HTTP exception', ['msg' => $e->getMessage()]);
            return response()->json(['error' => 'No se pudo conectar con la API de IA: ' . $e->getMessage()], 500);
        }

        // Save the AI reply
        IaMensaje::create([
            'user_id' => $userId,
            'role' => 'model',
            'content' => $aiReply,
        ]);

        return response()->json([
            'reply' => $aiReply,
            'created_at' => now()->toISOString(),
        ]);
    }

    /**
     * Clear conversation history for the authenticated user.
     */
    public function clearHistory(Request $request)
    {
        IaMensaje::where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Conversación reiniciada.']);
    }
}
