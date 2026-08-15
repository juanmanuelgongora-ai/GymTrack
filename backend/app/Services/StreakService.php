<?php

namespace App\Services;

use App\Models\SesionEntrenamiento;
use App\Models\Rutina;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StreakService
{
    /**
     * Calcula la racha actual de un usuario tomando en cuenta días de descanso y fines de semana.
     */
    public static function calculateForUser($user)
    {
        $sessions = SesionEntrenamiento::where('user_id', $user->id)
            ->select(DB::raw('DATE(created_at) as date'))
            ->distinct()
            ->orderBy('date', 'desc')
            ->get();

        $frequency = self::getRoutineFrequency($user);

        return self::calculate($sessions, $frequency);
    }

    /**
     * Lógica pura de cálculo (sin dependencias directas de DB para testing)
     */
    public static function calculate($sessions, $frequency = 3)
    {
        if ($sessions->isEmpty()) {
            return 0;
        }

        // Si entrena 3 o menos días, permitimos hasta 2 días de gap (ej: Lunes a Jueves)
        // Si entrena más, permitimos 1 día de gap (ej: Lunes a Miércoles)
        $maxGap = $frequency <= 3 ? 2 : 1;

        $lastSessionDate = Carbon::parse($sessions[0]->date)->startOfDay();
        $today = now()->startOfDay();

        // 1. Verificar si la racha se perdió (el tiempo desde la última sesión es excesivo)
        $diffFromToday = (int) $today->diffInDays($lastSessionDate, true);
        if ($diffFromToday > 0) {
            $allowed = self::isGapAllowed($lastSessionDate, $today, $maxGap);
            if (!$allowed) {
                return 0;
            }
        }

        // 2. Calcular la racha acumulada hacia atrás
        $streak = 1;
        $streak += $diffFromToday;

        $prevDate = $lastSessionDate;

        for ($i = 1; $i < $sessions->count(); $i++) {
            $currentDate = Carbon::parse($sessions[$i]->date)->startOfDay();
            $diff = (int) $prevDate->diffInDays($currentDate, true);

            // Verificamos si el espacio entre sesiones está permitido
            if (self::isGapAllowed($currentDate, $prevDate, $maxGap)) {
                $streak += $diff;
                $prevDate = $currentDate;
            } else {
                // Gap demasiado grande, racha se rompió aquí
                break;
            }
        }

        return $streak;
    }

    /**
     * Obtiene cuántos días a la semana entrena el usuario según su rutina activa.
     */
    private static function getRoutineFrequency($user)
    {
        $rutina = Rutina::where('user_id', $user->id)
            ->where('activa', true)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($rutina && isset($rutina->plan_semanal['dias'])) {
            return count($rutina->plan_semanal['dias']);
        }

        return 3; // Frecuencia por defecto si no hay rutina
    }

    /**
     * Verifica si un gap entre dos fechas es permitido (fines de semana o días de descanso).
     */
    private static function isGapAllowed($startDate, $endDate, $maxGap)
    {
        // El gap se analiza excluyendo los fines de semana
        $tempDate = clone $startDate;
        $tempDate->addDay();

        $nonWeekendGaps = 0;

        while ($tempDate->lt($endDate)) {
            if (!$tempDate->isWeekend()) {
                $nonWeekendGaps++;
            }
            $tempDate->addDay();
        }

        return $nonWeekendGaps <= $maxGap;
    }
}
