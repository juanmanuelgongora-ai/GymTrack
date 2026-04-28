<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SesionEntrenamiento;
use App\Models\Cliente;
use App\Models\MetricaCorporal;
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

        // Calcular días consecutivos (racha simple)
        // Buscamos las sesiones ordenadas por fecha y vemos si hay un salto mayor a 1 día
        $sesiones = SesionEntrenamiento::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function($date) {
                return \Carbon\Carbon::parse($date->created_at)->format('Y-m-d');
            });

        $racha = 0;
        $fecha_actual = now()->startOfDay();
        
        // Si no hay entrenamiento hoy ni ayer, racha es 0
        $dias_keys = $sesiones->keys();
        if ($dias_keys->isEmpty()) {
            $racha = 0;
        } else {
            $check_date = clone $fecha_actual;
            if (!$sesiones->has($check_date->format('Y-m-d'))) {
                // Verificar si al menos entrenó ayer
                $check_date->subDay();
                if (!$sesiones->has($check_date->format('Y-m-d'))) {
                    $racha = 0; // Se rompió
                }
            }
            
            // Contar hacia atrás
            if ($racha !== 0 || $sesiones->has(now()->startOfDay()->format('Y-m-d')) || $sesiones->has(now()->subDay()->startOfDay()->format('Y-m-d'))) {
                 // Reiniciar check
                 $check_date = clone $fecha_actual;
                 if (!$sesiones->has($check_date->format('Y-m-d'))) {
                     $check_date->subDay();
                 }
                 
                 while ($sesiones->has($check_date->format('Y-m-d'))) {
                     $racha++;
                     $check_date->subDay();
                 }
            }
        }

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
}
