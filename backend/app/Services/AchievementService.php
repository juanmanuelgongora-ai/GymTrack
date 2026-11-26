<?php

namespace App\Services;

use App\Models\Logro;
use App\Models\LogroUsuario;
use App\Models\SesionEntrenamiento;
use App\Models\MetricaCorporal;
use App\Models\Hito;
use App\Models\Cliente;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AchievementService
{
    /**
     * Evaluar y otorgar logros de racha basados en entrenamientos consecutivos.
     */
    public static function checkStreakAchievements($user)
    {
        $streak = StreakService::calculateForUser($user);

        if ($streak == 0)
            return [];

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
        if (!$cliente)
            return [];

        $count = MetricaCorporal::where('cliente_id', $cliente->id)->count();
        return self::grantByCategory($user, 'metricas', $count);
    }

    /**
     * Evaluar logros basados en hitos completados (objetivos).
     */
    public static function checkHitoAchievements($user)
    {
        Log::info("Evaluando logros de hitos para el usuario: {$user->id}");

        $cliente = Cliente::where('user_id', $user->id)->first();
        if (!$cliente) {
            Log::warning("No se encontró perfil de cliente para el usuario: {$user->id}");
            return [];
        }

        // Contar hitos de tipo 'fuerza' completados
        $fuerzaCompletados = Hito::where('cliente_id', $cliente->id)
            ->where('tipo', 'fuerza')
            ->where('estado', 'completado')
            ->count();

        Log::info("Hitos de fuerza completados: {$fuerzaCompletados}");

        $logrosFuerza = self::grantByCategory($user, 'fuerza', $fuerzaCompletados);

        // También evaluamos por categoría general 'objetivo' si existieran
        $totalCompletados = Hito::where('cliente_id', $cliente->id)
            ->where('estado', 'completado')
            ->count();

        Log::info("Total de hitos completados: {$totalCompletados}");

        $logrosObjetivo = self::grantByCategory($user, 'objetivo', $totalCompletados);

        $unlocked = array_merge($logrosFuerza, $logrosObjetivo);

        if (!empty($unlocked)) {
            Log::info("Nuevos logros desbloqueados por hitos: " . count($unlocked));
        }

        return $unlocked;
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
                Log::info("Desbloqueando logro: {$logro->nombre} para el usuario: {$user->id}");
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
