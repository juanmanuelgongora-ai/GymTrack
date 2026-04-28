<?php

namespace App\Services;

use App\Models\Logro;
use App\Models\LogroUsuario;
use App\Models\SesionEntrenamiento;
use App\Models\MetricaCorporal;
use App\Models\Hito;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AchievementService
{
    /**
     * Evaluar y otorgar logros de racha basados en entrenamientos consecutivos.
     */
    public static function checkStreakAchievements($user)
    {
        // Obtener sesiones únicas por día
        $sessions = SesionEntrenamiento::where('user_id', $user->id)
            ->select(DB::raw('DATE(created_at) as date'))
            ->distinct()
            ->orderBy('date', 'desc')
            ->get();

        if ($sessions->isEmpty()) return [];

        $streak = 1;
        $prevDate = Carbon::parse($sessions[0]->date);

        for ($i = 1; $i < $sessions->count(); $i++) {
            $currentDate = Carbon::parse($sessions[$i]->date);
            if ($prevDate->diffInDays($currentDate) == 1) {
                $streak++;
                $prevDate = $currentDate;
            } else {
                break;
            }
        }

        return self::grantByCategory($user, 'racha', $streak);
    }

    /**
     * Evaluar logros basados en el número total de entrenamientos.
     */
    public static function checkTrainingCountAchievements($user)
    {
        $count = SesionEntrenamiento::where('user_id', $user->id)->count();
        return self::grantByCategory($user, 'entrenamiento', $count);
    }

    /**
     * Evaluar logros basados en actualizaciones de métricas.
     */
    public static function checkMetricsAchievements($user)
    {
        $cliente = $user->cliente;
        if (!$cliente) return [];
        
        $count = MetricaCorporal::where('cliente_id', $cliente->id)->count();
        return self::grantByCategory($user, 'metricas', $count);
    }

    /**
     * Otorgar logros de una categoría si se cumple la meta.
     */
    private static function grantByCategory($user, $category, $currentValue)
    {
        $newAchievements = [];
        $availableLogros = Logro::where('categoria', $category)
            ->where('meta_valor', '<=', $currentValue)
            ->get();

        foreach ($availableLogros as $logro) {
            // Verificar si el usuario ya lo tiene
            $exists = LogroUsuario::where('user_id', $user->id)
                ->where('logro_id', $logro->id)
                ->exists();

            if (!$exists) {
                $unlocked = LogroUsuario::create([
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'logro_id' => $logro->id,
                    'fecha_obtencion' => now()
                ]);
                $newAchievements[] = $logro;
            }
        }

        return $newAchievements;
    }
}
