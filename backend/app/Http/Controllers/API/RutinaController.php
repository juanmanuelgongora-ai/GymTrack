<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rutina;
use App\Models\RutinaProgreso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RutinaController extends Controller
{
    public function generarRutinaInicial(Request $request)
    {
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
        $cliente = $user->cliente;

        // Si los datos no vienen en el request, completarlos con el perfil del cliente
        $objetivo = $data['objetivo'] ?? $cliente?->objetivo_principal;
        $frecuencia = $data['frecuencia'] ?? $cliente?->nivel_actividad;
        $genero = $data['genero'] ?? $cliente?->genero;
        $peso = $data['peso'] ?? $cliente?->peso_kg;
        $estatura = $data['estatura'] ?? $cliente?->altura_cm;
        $edad = $data['edad'] ?? $cliente?->edad;

        $condicionMedica = [];
        if ($cliente?->condicion_medica) {
            $condicionMedica = is_string($cliente->condicion_medica) ? json_decode($cliente->condicion_medica, true) : $cliente->condicion_medica;
        }

        $salud = $data['salud'] ?? ($condicionMedica['salud'] ?? null);
        $lesiones = $data['lesiones'] ?? ($condicionMedica['lesion'] ?? null);
        $condiciones = $data['condiciones'] ?? ($condicionMedica['condiciones'] ?? []);

        // Validar si hacen falta datos cruciales para armar un buen prompt para la IA
        $faltantes = [];
        if (empty($objetivo))
            $faltantes[] = 'objetivo_principal';
        if (empty($peso) || !is_numeric($peso))
            $faltantes[] = 'peso';
        if (empty($estatura) || !is_numeric($estatura))
            $faltantes[] = 'estatura';
        if (empty($edad) && empty($cliente?->fecha_nacimiento))
            $faltantes[] = 'edad';
        if (empty($genero))
            $faltantes[] = 'genero';

        if (!empty($faltantes)) {
            return response()->json([
                'success' => false,
                'falta_datos' => true,
                'campos_faltantes' => $faltantes,
                'message' => 'Se requieren datos físicos adicionales para que la IA genere tu rutina personalizada.',
                'datos_actuales' => [
                    'objetivo_principal' => $objetivo,
                    'peso' => $peso,
                    'estatura' => $estatura,
                    'genero' => $genero,
                    'edad' => $edad,
                    'frecuencia' => $frecuencia,
                    'salud' => $salud,
                    'lesion' => $lesiones,
                    'condiciones' => $condiciones
                ]
            ], 422);
        }

        // Asignar datos unificados
        $data['objetivo'] = $objetivo;
        $data['frecuencia'] = $frecuencia ?? '3-4 veces';
        $data['genero'] = $genero;
        $data['peso'] = $peso;
        $data['estatura'] = $estatura;
        $data['edad'] = $edad;
        $data['salud'] = $salud ?? 'Bueno';
        $data['lesiones'] = $lesiones ?? 'No';
        $data['condiciones'] = $condiciones;

        $apiKey = env('GEMINI_API_KEY');
        $planJson = null;

        if ($apiKey) {
            $prompt = "Actúa como un entrenador personal de élite. Diseña un plan de entrenamiento semanal estructurado de 3 a 5 días para el siguiente usuario:\n"
                . "Nombre: " . ($user->name ?? $user->nombre ?? 'Usuario') . "\n"
                . "Edad: " . ($data['edad'] ?? 'No especificada') . " años\n"
                . "Sexo: " . ($data['genero'] ?? 'No especificado') . "\n"
                . "Peso: " . ($data['peso'] ?? 'No especificado') . " kg\n"
                . "Estatura: " . ($data['estatura'] ?? 'No especificada') . " cm\n"
                . "Nivel de Actividad: " . ($data['frecuencia'] ?? '3-4 veces') . "\n"
                . "Objetivo Principal: " . ($data['objetivo'] ?? 'Mejorar condición física') . "\n"
                . "Nivel: " . ($data['nivel'] ?? 'Principiante') . "\n"
                . "Problemas de Salud: " . ($data['salud'] ?? 'Ninguno') . "\n"
                . "Lesiones: " . ($data['lesiones'] ?? 'No') . "\n"
                . "Condiciones: " . json_encode($data['condiciones'] ?? []) . "\n\n"
                . "Debes responder ÚNICAMENTE con un objeto JSON válido, sin bloques markdown de código ```json, sin explicaciones antes ni después.\n"
                . "La estructura del JSON debe ser exactamente:\n"
                . "{\n"
                . "  \"descripcion\": \"Breve resumen del enfoque del plan\",\n"
                . "  \"plan_semanal\": {\n"
                . "    \"dias\": [\n"
                . "      {\n"
                . "        \"dia\": \"Día 1\",\n"
                . "        \"grupo_muscular\": \"Pecho y Tríceps\",\n"
                . "        \"duracion_estimada\": \"60 min\",\n"
                . "        \"intensidad\": \"Alta\",\n"
                . "        \"semana_plan\": 1,\n"
                . "        \"ejercicios\": [\n"
                . "          {\n"
                . "            \"nombre\": \"Press de banca con barra\",\n"
                . "            \"series\": 4,\n"
                . "            \"repeticiones\": \"8-10\",\n"
                . "            \"descanso\": \"90s\"\n"
                . "          }\n"
                . "        ]\n"
                . "      }\n"
                . "    ]\n"
                . "  }\n"
                . "}";

            // Intentar modelos compatibles de Gemini
            $models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash'];

            foreach ($models as $model) {
                $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

                $payload = [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'topK' => 40,
                        'topP' => 0.95,
                        'maxOutputTokens' => 4096,
                        'responseMimeType' => 'application/json'
                    ]
                ];

                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Content-Type: application/json'
                ]);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($ch, CURLOPT_TIMEOUT, 20);

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $curlError = curl_error($ch);
                curl_close($ch);

                if ($httpCode === 200 && $response) {
                    $resData = json_decode($response, true);
                    if (isset($resData['candidates'][0]['content']['parts'][0]['text'])) {
                        $text = $resData['candidates'][0]['content']['parts'][0]['text'];
                        $text = preg_replace('/^```json\s*/i', '', $text);
                        $text = preg_replace('/```$/', '', trim($text));
                        $decoded = json_decode($text, true);
                        if ($decoded && isset($decoded['plan_semanal'])) {
                            $planJson = $decoded['plan_semanal'];
                            break;
                        } elseif ($decoded && isset($decoded['dias'])) {
                            $planJson = $decoded;
                            break;
                        }
                    }
                } else {
                    \Illuminate\Support\Facades\Log::warning("Gemini API call failed with model {$model}, HTTP code: {$httpCode}, error: {$curlError}");
                }
            }
        }

        if (!$planJson) {
            \Illuminate\Support\Facades\Log::info("Gemini models failed or not reachable. Generating intelligent fallback routine for user {$user->id}");
            $frecuencia = $data['frecuencia'] ?? 'Nunca';
            $isBeginner = in_array($frecuencia, ['Nunca', '1-2 veces']);
            $lesionStr = strtolower($data['lesiones'] ?? 'no');
            $hasLegInjury = str_contains($lesionStr, 'pierna') || str_contains($lesionStr, 'rodilla') || str_contains($lesionStr, 'ligamento') || str_contains($lesionStr, 'tobillo');
            $gender = strtolower($data['genero'] ?? 'm');
            $isFemale = ($gender === 'f' || $gender === 'femenino' || $gender === 'mujer');

            $dias = [];

            if ($isFemale) {
                $dias[] = [
                    "dia" => "Día 1",
                    "grupo_muscular" => "Tren Inferior Enfoque Glúteos",
                    "duracion_estimada" => "55 min",
                    "intensidad" => "Media-Alta",
                    "semana_plan" => 1,
                    "ejercicios" => [
                        ["nombre" => $hasLegInjury ? "Puente de Glúteo (Isométrico)" : "Hip Thrust", "series" => $isBeginner ? 3 : 4, "repeticiones" => "12-15", "descanso" => "90s"],
                        ["nombre" => $hasLegInjury ? "Patada de glúteo en banda" : "Sentadilla Búlgara", "series" => $isBeginner ? 3 : 4, "repeticiones" => "10-12", "descanso" => "90s"],
                        ["nombre" => "Abducciones en máquina", "series" => 3, "repeticiones" => "15", "descanso" => "60s"]
                    ]
                ];
            } else {
                $dias[] = [
                    "dia" => "Día 1",
                    "grupo_muscular" => "Parte Superior (Pecho y Espalda)",
                    "duracion_estimada" => "60 min",
                    "intensidad" => "Alta",
                    "semana_plan" => 1,
                    "ejercicios" => [
                        ["nombre" => "Press de Pecho en máquina / Push-ups", "series" => $isBeginner ? 3 : 4, "repeticiones" => "10-12", "descanso" => "60s"],
                        ["nombre" => "Jalón al pecho / Remo", "series" => $isBeginner ? 3 : 4, "repeticiones" => "10-12", "descanso" => "60s"]
                    ]
                ];
            }

            if (!$hasLegInjury && !$isFemale) {
                $dias[] = [
                    "dia" => "Día 2",
                    "grupo_muscular" => "Tren Inferior (Piernas)",
                    "duracion_estimada" => "70 min",
                    "intensidad" => "Alta",
                    "semana_plan" => 1,
                    "ejercicios" => [
                        ["nombre" => "Sentadillas / Prensa de Piernas", "series" => $isBeginner ? 3 : 4, "repeticiones" => "12-15", "descanso" => "90s"],
                        ["nombre" => "Extensiones de Cuádriceps", "series" => 3, "repeticiones" => "15", "descanso" => "60s"]
                    ]
                ];
            } else if (!$hasLegInjury && $isFemale) {
                $dias[] = [
                    "dia" => "Día 2",
                    "grupo_muscular" => "Tren Superior Tonificación Ligera",
                    "duracion_estimada" => "45 min",
                    "intensidad" => "Media",
                    "semana_plan" => 1,
                    "ejercicios" => [
                        ["nombre" => "Remo en polea", "series" => 3, "repeticiones" => "15", "descanso" => "60s"],
                        ["nombre" => "Elevaciones laterales ligeras", "series" => 3, "repeticiones" => "15", "descanso" => "60s"]
                    ]
                ];
            } else {
                $dias[] = [
                    "dia" => "Día 2",
                    "grupo_muscular" => "Core y Movilidad (Evitando zona lesionada)",
                    "duracion_estimada" => "40 min",
                    "intensidad" => "Baja-Media",
                    "semana_plan" => 1,
                    "ejercicios" => [
                        ["nombre" => "Plancha abdominal (Plank)", "series" => 3, "repeticiones" => "30-45s", "descanso" => "45s"],
                        ["nombre" => "Elevaciones de tronco (Crunches)", "series" => 3, "repeticiones" => "15-20", "descanso" => "45s"]
                    ]
                ];
            }

            if ($isFemale) {
                $dias[] = [
                    "dia" => "Día 3",
                    "grupo_muscular" => "Isquiosurales y Core",
                    "duracion_estimada" => "50 min",
                    "intensidad" => "Media",
                    "semana_plan" => 1,
                    "ejercicios" => [
                        ["nombre" => $hasLegInjury ? "Bird Dog (Core)" : "Peso Muerto Rumano", "series" => 3, "repeticiones" => "12", "descanso" => "60s"],
                        ["nombre" => $hasLegInjury ? "Plancha lateral" : "Curl Femoral Acostado", "series" => 3, "repeticiones" => "15", "descanso" => "60s"]
                    ]
                ];
            } else {
                $dias[] = [
                    "dia" => "Día 3",
                    "grupo_muscular" => "Hombros y Brazos",
                    "duracion_estimada" => "55 min",
                    "intensidad" => "Media",
                    "semana_plan" => 1,
                    "ejercicios" => [
                        ["nombre" => "Elevaciones laterales", "series" => 3, "repeticiones" => "12-15", "descanso" => "60s"],
                        ["nombre" => "Curl de Bíceps", "series" => 3, "repeticiones" => "12", "descanso" => "60s"],
                        ["nombre" => "Extensión de Tríceps", "series" => 3, "repeticiones" => "12", "descanso" => "60s"]
                    ]
                ];
            }

            if (!$isBeginner) {
                $dias[] = [
                    "dia" => "Día 4",
                    "grupo_muscular" => "Cardio y Resistencia Metabólica",
                    "duracion_estimada" => "30 min",
                    "intensidad" => "Alta",
                    "semana_plan" => 1,
                    "ejercicios" => [
                        ["nombre" => $hasLegInjury ? "Natación o Bicicleta estática (suave)" : "Burpees / Saltos", "series" => 4, "repeticiones" => "10-15 min", "descanso" => "30s"],
                        ["nombre" => "Mountain Climbers", "series" => 4, "repeticiones" => "20", "descanso" => "30s"]
                    ]
                ];
                $dias[] = [
                    "dia" => "Día 5",
                    "grupo_muscular" => $isFemale ? "Glúteos y Piernas (Repaso Vol.)" : "Cuerpo Completo (Repaso)",
                    "duracion_estimada" => "60 min",
                    "intensidad" => "Alta",
                    "semana_plan" => 1,
                    "ejercicios" => [
                        ["nombre" => $isFemale ? "Patada polea baja" : "Dominadas asistidas / Remo", "series" => 4, "repeticiones" => "8-10", "descanso" => "60s"],
                        ["nombre" => "Flexiones / Abdomen", "series" => 4, "repeticiones" => "Fallo", "descanso" => "60s"]
                    ]
                ];
            }

            $planJson = ["dias" => $dias];
        }

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

        $progreso = RutinaProgreso::where('user_id', $user->id)
            ->where('rutina_id', $rutina->id)
            ->first();

        // Si tenemos progreso registrado pero fue modificado antes de esta semana,
        // significa que cambiamos de semana y debemos borrarlo para volver a empezar.
        $inicioSemana = now()->startOfWeek();
        if ($progreso && $progreso->updated_at < $inicioSemana && !empty($progreso->progreso_json)) {
            $progreso->progreso_json = [];
            $progreso->save();
        }

        // Calcular la semana de entrenamiento actual:
        // semanas transcurridas entre la semana de creación de la rutina y la semana actual + 1
        $semanasTranscurridas = $inicioSemana->diffInWeeks($rutina->created_at->startOfWeek());
        $semanaActual = 1 + intval($semanasTranscurridas);

        return response()->json([
            'rutina' => $rutina,
            'semana_actual' => $semanaActual,
            'progreso_guardado' => $progreso ? $progreso->progreso_json : null
        ]);
    }

    /**
     * Sincroniza el progreso de ejercicios en tiempo real
     */
    public function syncProgress(Request $request)
    {
        $data = $request->validate([
            'rutina_id' => 'required|uuid',
            'progreso_json' => 'required|array',
        ]);

        $user = $request->user();

        $progreso = RutinaProgreso::updateOrCreate(
            [
                'user_id' => $user->id,
                'rutina_id' => $data['rutina_id'],
            ],
            [
                'progreso_json' => $data['progreso_json'],
            ]
        );

        return response()->json([
            'status' => 'synced',
            'progreso' => $progreso
        ]);
    }

    /**
     * Obtiene el progreso guardado para una rutina específica
     */
    public function getProgress(Request $request, $rutinaId)
    {
        $user = $request->user();

        $progreso = RutinaProgreso::where('user_id', $user->id)
            ->where('rutina_id', $rutinaId)
            ->first();

        return response()->json([
            'progreso_guardado' => $progreso ? $progreso->progreso_json : null
        ]);
    }

    /**
     * Guarda una rutina personalizada creada por el cliente
     * y la activa, desactivando la anterior.
     */
    public function guardarRutinaPersonalizada(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'nullable|string|max:120',
            'plan_semanal' => 'required|array',
            'plan_semanal.dias' => 'required|array|min:1',
        ]);

        $user = $request->user();

        // Desactivar rutinas anteriores
        Rutina::where('user_id', $user->id)
            ->where('activa', true)
            ->update(['activa' => false]);

        $rutina = Rutina::create([
            'user_id' => $user->id,
            'plan_semanal' => $data['plan_semanal'],
            'activa' => true,
        ]);

        return response()->json([
            'message' => 'Rutina personalizada guardada y activada.',
            'rutina' => $rutina,
        ], 201);
    }
}
