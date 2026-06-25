<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SesionEntrenamiento;
use App\Models\Cliente;
use App\Models\MetricaCorporal;
use App\Models\Hito;
use Illuminate\Http\Request;

class EntrenamientoController extends Controller
{
    /**
     * Registra una sesión de entrenamiento finalizada
     */
    public function registrar(Request $request)
    {
        $data = $request->validate([
            'rutina_id' => 'nullable|uuid',
            'dia_rutina' => 'required|string',
            'duracion_minutos' => 'required|integer',
            'detalles_sesion' => 'required|array'
        ]);

        $user = $request->user();

        // VALIDACIÓN GT-77: Evitar duplicados en la misma semana
        // Si el usuario ya entrenó este día de la rutina esta semana, no creamos nuevo registro
        $inicioSemana = now()->startOfWeek(); // Por defecto Lunes
        $yaExiste = SesionEntrenamiento::where('user_id', $user->id)
            ->where('rutina_id', $data['rutina_id'] ?? null)
            ->where('dia_rutina', $data['dia_rutina'])
            ->where('created_at', '>=', $inicioSemana)
            ->first();

        if ($yaExiste) {
            return response()->json([
                'message' => 'Este día ya fue completado y registrado esta semana.',
                'sesion' => $yaExiste,
                'logros_desbloqueados' => []
            ], 200); // Retornamos 200 OK pero con el registro anterior
        }

        $sesion = SesionEntrenamiento::create([
            'user_id' => $user->id,
            'rutina_id' => $data['rutina_id'] ?? null,
            'dia_rutina' => $data['dia_rutina'],
            'duracion_minutos' => $data['duracion_minutos'],
            'detalles_sesion' => $data['detalles_sesion']
        ]);

        // Verificar logros
        $unlocked = array_merge(
            \App\Services\AchievementService::checkStreakAchievements($user),
            \App\Services\AchievementService::checkTrainingCountAchievements($user)
        );

        // ---- AUTOMATIZACIÓN GT-54: Actualizar Hitos con PRs reales ----
        $this->actualizarHitosDesdeSesion($user, $data['detalles_sesion']);
        // -----------------------------------------------------------

        return response()->json([
            'message' => 'Sesión guardada correctamente',
            'sesion' => $sesion,
            'logros_desbloqueados' => $unlocked
        ], 201);
    }

    /**
     * Obtiene métricas e historial de los entrenamientos del usuario
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        $entrenamientos_mes = SesionEntrenamiento::where('user_id', $user->id)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Calcular racha de días usando el StreakService flexible
        $racha = \App\Services\StreakService::calculateForUser($user);

        // Calcular progreso de objetivos (Simulado basado en actividad real)
        $total_minutos = SesionEntrenamiento::where('user_id', $user->id)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('duracion_minutos');

        $progreso_fuerza = min(100, round(($entrenamientos_mes / 12) * 100));
        $progreso_peso = min(100, round(($total_minutos / 240) * 100));

        // Calcular variación de peso
        $cliente = Cliente::where('user_id', $user->id)->first();
        $variacion_peso = 0;
        if ($cliente) {
            $primera_metrica = MetricaCorporal::where('cliente_id', $cliente->id)->orderBy('fecha', 'asc')->first();
            $ultima_metrica = MetricaCorporal::where('cliente_id', $cliente->id)->orderBy('fecha', 'desc')->first();
            if ($primera_metrica && $ultima_metrica && $primera_metrica->id !== $ultima_metrica->id) {
                $variacion_peso = round($ultima_metrica->peso_kg - $primera_metrica->peso_kg, 1);
            }
        }

        return response()->json([
            'entrenamientos_mes' => $entrenamientos_mes,
            'racha_dias' => $racha,
            'progreso_fuerza' => $progreso_fuerza,
            'progreso_peso' => $progreso_peso,
            'variacion_peso' => $variacion_peso,
            'historial' => SesionEntrenamiento::where('user_id', $user->id)->orderBy('created_at', 'desc')->take(10)->get()
        ]);
    }

    /**
     * Lógica para actualizar hitos automáticamente basándose en los pesos de la sesión.
     */
    private function actualizarHitosDesdeSesion($user, $detalles)
    {
        $cliente = Cliente::where('user_id', $user->id)->first();
        if (!$cliente || !$detalles)
            return;

        $hitos = Hito::where('cliente_id', $cliente->id)
            ->where('estado', 'en_progreso')
            ->get();

        foreach ($detalles as $nameOrId => $progreso) {
            $mejorPesoEnSesion = 0;
            if (isset($progreso['completedSets']) && is_array($progreso['completedSets'])) {
                foreach ($progreso['completedSets'] as $set) {
                    if (isset($set['peso'])) {
                        $mejorPesoEnSesion = max($mejorPesoEnSesion, (float) $set['peso']);
                    }
                }
            }

            if ($mejorPesoEnSesion <= 0)
                continue;

            $ejercicioNombre = is_string($nameOrId) ? $nameOrId : 'Ejercicio';
            // Solo sincronizamos si ya existe un objetivo manual para este ejercicio
            $hitoExistente = $hitos->first(function ($h) use ($ejercicioNombre) {
                return str_contains(strtolower($ejercicioNombre), strtolower($h->titulo));
            });

            if ($hitoExistente && $mejorPesoEnSesion > $hitoExistente->valor_actual) {
                $hitoExistente->valor_actual = $mejorPesoEnSesion;

                $denominador = $hitoExistente->meta_valor - $hitoExistente->valor_inicial;
                if ($denominador != 0) {
                    $hitoExistente->progreso_porcentaje = min(100, max(0, round((($hitoExistente->valor_actual - $hitoExistente->valor_inicial) / $denominador) * 100)));
                }

                if ($hitoExistente->progreso_porcentaje >= 100) {
                    $hitoExistente->estado = 'completado';
                }

                $hitoExistente->save();
            }
        }
    }
}
