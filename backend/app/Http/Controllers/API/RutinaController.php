<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rutina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RutinaController extends Controller
{
    public function generarRutinaInicial(Request $request)
    {
        // Require at least base data since it may come from the onboarding flow
        $data = $request->validate([
            'objetivo' => 'nullable|string',
            'frecuencia' => 'nullable|string',
            'equipamiento' => 'nullable|string',
            'salud' => 'nullable|string',
            'lesiones' => 'nullable|string',
            'condiciones' => 'nullable|array',
            'nivel' => 'nullable|string',
            'genero' => 'nullable|string',
            'peso' => 'nullable|numeric|string',
            'estatura' => 'nullable|numeric|string',
            'edad' => 'nullable|numeric|string'
        ]);

        $user = $request->user();

        // Check if there is an AI API Key
        $apiKey = env('GEMINI_API_KEY');
        $planJson = null;

        if ($apiKey) {
            // Attempt to call Gemini API to generate the plan
            $prompt = "Actúa como un entrenador personal experto de vanguardia. Tu trabajo es diseñar minuciosamente una rutina semanal detallada en formato estrictamente JSON." . "\n"
                . "PERFIL BIOLÓGICO DEL CLIENTE:\n"
                . "- Género: " . ($data['genero'] ?? 'No especificado') . "\n"
                . "- Edad: " . ($data['edad'] ?? 'No especificada') . " años\n"
                . "- Peso: " . ($data['peso'] ?? 'No especificado') . " kg\n"
                . "- Estatura: " . ($data['estatura'] ?? 'No especificada') . " cm\n\n"
                . "HISTORIAL Y OBJETIVOS:\n"
                . "- Objetivo principal: " . ($data['objetivo'] ?? 'Mejorar condición física') . "\n"
                . "- Historial de actividad física previa: " . ($data['frecuencia'] ?? '3-4 veces') . ". (Deduce nivel a partir de esto).\n"
                . "- Nivel de experiencia deducido: " . ($data['nivel'] ?? 'Principiante') . "\n\n"
                . "VARIABLES FÍSICAS LIMITANTES:\n"
                . "- Problemas de Salud: " . ($data['salud'] ?? 'Ninguno') . "\n"
                . "- Lesiones: " . ($data['lesiones'] ?? 'No') . "\n"
                . "- Condiciones: " . ($data['condiciones'] ?? 'Ninguna') . "\n\n"
                . "INSTRUCCIÓN CRÍTICA DE DISEÑO:\n"
                . "1. Basándote en el historial de actividad, deduce la cantidad de días de entrenamiento (Nunca=3; 5 o más=5; intermedio=4).\n"
                . "2. INSTRUCCIÓN DE GÉNERO: El análisis debe cambiar según el género si corresponde. Mujeres generalmente priorizan Tren Inferior (Glúteos/Isquios/Cuádriceps) unos 2-3 días, mientras que Hombres suelen darle más espacio al Tren Superior. Si la chica prioriza otra cosa en su 'Objetivo', hazle caso a eso, de lo contrario asume el estándar.\n"
                . "3. Cuida el peso, edad y sobre todo lesiones: evita por completo la zona lesionada.\n\n"
                . "El JSON debe tener la siguiente estructura estricta (y NO devuelvas NADA más que el JSON puro, sin tags de markdown):" . "\n"
                . "{ \"dias\": [ { \"dia\": \"Día 1\", \"grupo_muscular\": \"Glúteos y Piernas (Enfoque Femenino)\", \"ejercicios\": [ { \"nombre\": \"Hip Thrust\", \"series\": 4, \"repeticiones\": \"10-12\", \"descanso\": \"90s\" } ] } ] }";

            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json'
                ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ]
                ]);

                if ($response->successful()) {
                    $result = $response->json();
                    $textResponse = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

                    if ($textResponse) {
                        // Strip markdown parsing if it was wrapped in ```json
                        $textResponse = preg_replace('/```(?:json)?\n?(.*?)\n?```/ms', '$1', $textResponse);
                        $parsedJson = json_decode(trim($textResponse), true);
                        if (json_last_error() === JSON_ERROR_NONE && isset($parsedJson['dias'])) {
                            $planJson = $parsedJson;
                        }
                    }
                }
            }
            catch (\Exception $e) {
            // Ignore exception to fallback
            }
        }

        // Fallback or Mock mechanism if Gemini API key implies an error or is missing
        if (!$planJson) {
            $frecuencia = $data['frecuencia'] ?? 'Nunca';
            $isBeginner = in_array($frecuencia, ['Nunca', '1-2 veces']);

            $lesionStr = strtolower($data['lesiones'] ?? 'no');
            $hasLegInjury = str_contains($lesionStr, 'pierna') || str_contains($lesionStr, 'rodilla') || str_contains($lesionStr, 'ligamento') || str_contains($lesionStr, 'tobillo');

            $gender = strtolower($data['genero'] ?? 'm');
            $isFemale = ($gender === 'f' || $gender === 'femenino' || $gender === 'mujer');

            $dias = [];

            // Día 1
            if ($isFemale) {
                $dias[] = [
                    "dia" => "Día 1",
                    "grupo_muscular" => "Tren Inferior Enfoque Glúteos",
                    "ejercicios" => [
                        ["nombre" => $hasLegInjury ? "Puente de Glúteo (Isométrico)" : "Hip Thrust", "series" => $isBeginner ? 3 : 4, "repeticiones" => "12-15", "descanso" => "90s"],
                        ["nombre" => $hasLegInjury ? "Patada de glúteo en banda" : "Sentadilla Búlgara", "series" => $isBeginner ? 3 : 4, "repeticiones" => "10-12", "descanso" => "90s"],
                        ["nombre" => "Abducciones en máquina", "series" => 3, "repeticiones" => "15", "descanso" => "60s"]
                    ]
                ];
            }
            else {
                $dias[] = [
                    "dia" => "Día 1",
                    "grupo_muscular" => "Parte Superior (Pecho y Espalda)",
                    "ejercicios" => [
                        ["nombre" => "Press de Pecho en máquina / Push-ups", "series" => $isBeginner ? 3 : 4, "repeticiones" => "10-12", "descanso" => "60s"],
                        ["nombre" => "Jalón al pecho / Remo", "series" => $isBeginner ? 3 : 4, "repeticiones" => "10-12", "descanso" => "60s"]
                    ]
                ];
            }

            // Día 2
            if (!$hasLegInjury && !$isFemale) {
                $dias[] = [
                    "dia" => "Día 2",
                    "grupo_muscular" => "Tren Inferior (Piernas)",
                    "ejercicios" => [
                        ["nombre" => "Sentadillas / Prensa de Piernas", "series" => $isBeginner ? 3 : 4, "repeticiones" => "12-15", "descanso" => "90s"],
                        ["nombre" => "Extensiones de Cuádriceps", "series" => 3, "repeticiones" => "15", "descanso" => "60s"]
                    ]
                ];
            }
            else if (!$hasLegInjury && $isFemale) {
                $dias[] = [
                    "dia" => "Día 2",
                    "grupo_muscular" => "Tren Superior Tonificación Ligera",
                    "ejercicios" => [
                        ["nombre" => "Remo en polea", "series" => 3, "repeticiones" => "15", "descanso" => "60s"],
                        ["nombre" => "Elevaciones laterales ligeras", "series" => 3, "repeticiones" => "15", "descanso" => "60s"]
                    ]
                ];
            }
            else {
                $dias[] = [
                    "dia" => "Día 2",
                    "grupo_muscular" => "Core y Movilidad (Evitando zona lesionada)",
                    "ejercicios" => [
                        ["nombre" => "Plancha abdominal (Plank)", "series" => 3, "repeticiones" => "30-45s", "descanso" => "45s"],
                        ["nombre" => "Elevaciones de tronco (Crunches)", "series" => 3, "repeticiones" => "15-20", "descanso" => "45s"]
                    ]
                ];
            }

            // Día 3
            if ($isFemale) {
                $dias[] = [
                    "dia" => "Día 3",
                    "grupo_muscular" => "Isquiosurales y Core",
                    "ejercicios" => [
                        ["nombre" => $hasLegInjury ? "Bird Dog (Core)" : "Peso Muerto Rumano", "series" => 3, "repeticiones" => "12", "descanso" => "60s"],
                        ["nombre" => $hasLegInjury ? "Plancha lateral" : "Curl Femoral Acostado", "series" => 3, "repeticiones" => "15", "descanso" => "60s"]
                    ]
                ];
            }
            else {
                $dias[] = [
                    "dia" => "Día 3",
                    "grupo_muscular" => "Hombros y Brazos",
                    "ejercicios" => [
                        ["nombre" => "Elevaciones laterales", "series" => 3, "repeticiones" => "12-15", "descanso" => "60s"],
                        ["nombre" => "Curl de Bíceps", "series" => 3, "repeticiones" => "12", "descanso" => "60s"],
                        ["nombre" => "Extensión de Tríceps", "series" => 3, "repeticiones" => "12", "descanso" => "60s"]
                    ]
                ];
            }

            // Si no es principiante, agregar más días
            if (!$isBeginner) {
                $dias[] = [
                    "dia" => "Día 4",
                    "grupo_muscular" => "Cardio y Resistencia Metabólica",
                    "ejercicios" => [
                        ["nombre" => $hasLegInjury ? "Natación o Bicicleta estática (suave)" : "Burpees / Saltos", "series" => 4, "repeticiones" => "10-15 min", "descanso" => "30s"],
                        ["nombre" => "Mountain Climbers", "series" => 4, "repeticiones" => "20", "descanso" => "30s"]
                    ]
                ];

                $dias[] = [
                    "dia" => "Día 5",
                    "grupo_muscular" => $isFemale ? "Glúteos y Piernas (Repaso Vol.)" : "Cuerpo Completo (Repaso)",
                    "ejercicios" => [
                        ["nombre" => $isFemale ? "Patada polea baja" : "Dominadas asistidas / Remo", "series" => 4, "repeticiones" => "8-10", "descanso" => "60s"],
                        ["nombre" => "Flexiones / Abdomen", "series" => 4, "repeticiones" => "Fallo", "descanso" => "60s"]
                    ]
                ];
            }

            $planJson = ["dias" => $dias];
        }

        // Save new routine to database
        $rutina = Rutina::create([
            'user_id' => $user->id,
            'plan_semanal' => $planJson,
            'activa' => true,
        ]);

        return response()->json([
            'message' => 'Rutina generada exitosamente.',
            'rutina' => $rutina
        ], 201);
    }

    public function getLatestRoutine(Request $request)
    {
        $user = $request->user();

        $rutina = Rutina::where('user_id', $user->id)
            ->where('activa', true)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$rutina) {
            return response()->json(['message' => 'No se encontró rutina.'], 404);
        }

        return response()->json([
            'rutina' => $rutina
        ]);
    }
}
