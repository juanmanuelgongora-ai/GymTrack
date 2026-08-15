<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PlanAlimentacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PlanAlimentacionController extends Controller
{
    /** GET /api/alimentacion – Returns the active plan for the authenticated user */
    public function getActivePlan(Request $request)
    {
        $userId = $request->user()->id;

        $plan = PlanAlimentacion::where('user_id', $userId)
            ->where('activo', true)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$plan) {
            return response()->json(['plan' => null], 200);
        }

        return response()->json(['plan' => $plan->plan_json]);
    }

    /** POST /api/alimentacion/generar – Uses Gemini to create a personalised 7-day meal plan */
    public function generarPlan(Request $request)
    {
        $request->validate([
            'objetivo' => 'nullable|string',
            'peso' => 'nullable|numeric',
            'estatura' => 'nullable|numeric',
            'genero' => 'nullable|string',
            'edad' => 'nullable|numeric|string',
            'actividad' => 'nullable|string',
        ]);

        $user = $request->user();
        $userId = $user->id;

        $apiKey = env('GEMINI_API_KEY');
        if (empty($apiKey)) {
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

        $objetivo = $request->input('objetivo', 'Salud general');
        $peso = $request->input('peso', 70);
        $estatura = $request->input('estatura', 170);
        $genero = $request->input('genero', 'No especificado');
        $edad = $request->input('edad', 25);
        $actividad = $request->input('actividad', 'Moderada');

        $planJson = null;

        if ($apiKey) {
            $prompt = "Eres un nutricionista profesional. Crea un plan de alimentación COMPLETO para 7 días (Lunes a Domingo) en formato JSON estricto, personalizado para este perfil:\n"
                . "- Objetivo: {$objetivo}\n"
                . "- Género: {$genero}\n"
                . "- Peso: {$peso} kg, Estatura: {$estatura} cm, Edad: {$edad} años\n"
                . "- Nivel de actividad: {$actividad}\n\n"
                . "REGLA DE FORMATO: Devuelve ÚNICAMENTE el JSON puro, sin markdown, sin explicaciones, sin texto adicional.\n"
                . "IMAGEN: Para cada comida incluye un campo 'img_query' con 2-3 palabras clave en inglés relacionadas con el plato para buscar foto (ej: 'oatmeal berries', 'grilled chicken rice', 'salmon salad').\n\n"
                . "Estructura JSON obligatoria:\n"
                . '{"dias":[{"dia":"Lunes","comidas":[{"id":1,"hora":"07:00","nombre":"Desayuno","descripcion":"Descripción del plato","kcal":450,"p":30,"c":55,"g":10,"img_query":"oatmeal fruits"},{"id":2,"hora":"10:00","nombre":"Media Mañana","descripcion":"...","kcal":200,"p":15,"c":25,"g":5,"img_query":"greek yogurt nuts"},{"id":3,"hora":"13:00","nombre":"Almuerzo","descripcion":"...","kcal":600,"p":45,"c":60,"g":15,"img_query":"chicken breast rice"},{"id":4,"hora":"16:00","nombre":"Merienda","descripcion":"...","kcal":180,"p":10,"c":20,"g":5,"img_query":"apple protein bar"},{"id":5,"hora":"19:30","nombre":"Cena","descripcion":"...","kcal":450,"p":40,"c":35,"g":12,"img_query":"salmon vegetables"}]}]}';

            try {
                $response = Http::timeout(45)->post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={$apiKey}",
                    ['contents' => [['parts' => [['text' => $prompt]]]]]
                );

                if ($response->successful()) {
                    $result = $response->json();
                    $textResponse = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;
                    if ($textResponse) {
                        $textResponse = preg_replace('/```(?:json)?\n?(.*?)\n?```/ms', '$1', $textResponse);
                        $parsed = json_decode(trim($textResponse), true);
                        if (json_last_error() === JSON_ERROR_NONE && isset($parsed['dias'])) {
                            $planJson = $parsed;
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error('Error generando plan alimentario con Gemini', ['error' => $e->getMessage()]);
            }
        }

        // Fallback: generic plan if Gemini unavailable
        if (!$planJson) {
            $diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            $dias = [];
            foreach ($diasSemana as $dia) {
                $dias[] = [
                    'dia' => $dia,
                    'comidas' => [
                        ['id' => 1, 'hora' => '07:00', 'nombre' => 'Desayuno', 'descripcion' => 'Avena con leche y frutas mixtas', 'kcal' => 420, 'p' => 25, 'c' => 55, 'g' => 10, 'img_query' => 'oatmeal berries'],
                        ['id' => 2, 'hora' => '10:00', 'nombre' => 'Media Mañana', 'descripcion' => 'Yogurt griego con nueces', 'kcal' => 210, 'p' => 18, 'c' => 20, 'g' => 8, 'img_query' => 'greek yogurt nuts'],
                        ['id' => 3, 'hora' => '13:00', 'nombre' => 'Almuerzo', 'descripcion' => 'Pechuga de pollo con arroz integral y ensalada', 'kcal' => 620, 'p' => 50, 'c' => 65, 'g' => 12, 'img_query' => 'chicken breast rice'],
                        ['id' => 4, 'hora' => '16:30', 'nombre' => 'Merienda', 'descripcion' => 'Manzana con mantequilla de maní', 'kcal' => 190, 'p' => 8, 'c' => 24, 'g' => 8, 'img_query' => 'apple peanut butter'],
                        ['id' => 5, 'hora' => '19:30', 'nombre' => 'Cena', 'descripcion' => 'Salmón al horno con brócoli y batata', 'kcal' => 510, 'p' => 42, 'c' => 38, 'g' => 18, 'img_query' => 'salmon broccoli'],
                    ]
                ];
            }
            $planJson = ['dias' => $dias];
        }

        // Deactivate previous plans
        PlanAlimentacion::where('user_id', $userId)->update(['activo' => false]);

        $plan = PlanAlimentacion::create([
            'user_id' => $userId,
            'plan_json' => $planJson,
            'activo' => true,
        ]);

        return response()->json([
            'message' => 'Plan de alimentación generado exitosamente.',
            'plan' => $plan->plan_json,
        ], 201);
    }

    /** PUT /api/alimentacion – Saves the manually edited plan */
    public function updatePlan(Request $request)
    {
        $request->validate([
            'plan_json' => 'required|array',
            'plan_json.dias' => 'required|array|min:1',
        ]);

        $userId = $request->user()->id;

        PlanAlimentacion::where('user_id', $userId)->update(['activo' => false]);

        $plan = PlanAlimentacion::create([
            'user_id' => $userId,
            'plan_json' => $request->plan_json,
            'activo' => true,
        ]);

        return response()->json([
            'message' => 'Plan de alimentación actualizado.',
            'plan' => $plan->plan_json,
        ]);
    }
}
