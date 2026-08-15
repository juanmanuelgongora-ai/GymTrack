<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SesionEntrenamiento;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AnaliticasController extends Controller
{
    /**
     * Obtener lista de ejercicios que tienen al menos 2 registros de peso.
     */
    public function getEjerciciosConProgreso(Request $request)
    {
        $user = $request->user();
        $sesiones = SesionEntrenamiento::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $counts = [];
        $ejerciciosData = [];

        foreach ($sesiones as $sesion) {
            $detalles = $sesion->detalles_sesion;
            if (!$detalles)
                continue;

            foreach ($detalles as $ejercicio => $progreso) {
                if (!isset($progreso['completedSets']) || !is_array($progreso['completedSets']))
                    continue;

                $tienePeso = false;
                foreach ($progreso['completedSets'] as $set) {
                    if (isset($set['peso']) && (float) $set['peso'] > 0) {
                        $tienePeso = true;
                        break;
                    }
                }

                if ($tienePeso) {
                    $counts[$ejercicio] = ($counts[$ejercicio] ?? 0) + 1;
                    if (!isset($ejerciciosData[$ejercicio])) {
                        $ejerciciosData[$ejercicio] = [
                            'id' => $ejercicio, // Usamos el nombre como ID por ahora
                            'titulo' => $ejercicio,
                            'tipo' => 'fuerza',
                            'registros_count' => 0
                        ];
                    }
                }
            }
        }

        // Filtrar solo los que tienen al menos 2 sesiones (GT-55 estricto)
        $resultado = [];
        foreach ($ejerciciosData as $nombre => $data) {
            if ($counts[$nombre] >= 2) {
                $data['registros_count'] = $counts[$nombre];
                $resultado[] = $data;
            }
        }

        return response()->json($resultado);
    }

    /**
     * Obtener el historial de progreso para un ejercicio específico por nombre.
     */
    public function getHistorialEjercicio(Request $request)
    {
        $request->validate(['ejercicio' => 'required|string']);
        $user = $request->user();
        $ejercicioBuscado = strtolower($request->ejercicio);

        $sesiones = SesionEntrenamiento::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        $historico = [];
        foreach ($sesiones as $sesion) {
            $detalles = $sesion->detalles_sesion;
            if (!$detalles)
                continue;

            $maxPeso = 0;
            $encontrado = false;

            foreach ($detalles as $nombre => $progreso) {
                if (strtolower($nombre) === $ejercicioBuscado) {
                    if (isset($progreso['completedSets']) && is_array($progreso['completedSets'])) {
                        foreach ($progreso['completedSets'] as $set) {
                            if (isset($set['peso'])) {
                                $maxPeso = max($maxPeso, (float) $set['peso']);
                                $encontrado = true;
                            }
                        }
                    }
                }
            }

            if ($encontrado && $maxPeso > 0) {
                $historico[] = [
                    'label' => 'Sesión ' . (count($historico) + 1),
                    'fecha' => Carbon::parse($sesion->created_at)->format('d/m'),
                    'peso' => $maxPeso,
                    'variacion' => count($historico) > 0 ? (round($maxPeso - end($historico)['peso'], 1)) . ' kg' : '+0',
                ];
            }
        }

        if (empty($historico)) {
            return response()->json(['message' => 'No hay historial para este ejercicio'], 404);
        }

        $primero = $historico[0]['peso'];
        $ultimo = end($historico)['peso'];
        $maximo = max(array_column($historico, 'peso'));

        // Ya no dependemos de un Hito para el "Objetivo", pero podemos sugerir uno 
        // o simplemente reportar el progreso neto.
        return response()->json([
            'ejercicio' => $request->ejercicio,
            'inicial' => $primero,
            'actual' => $ultimo,
            'maximo' => $maximo,
            'sesiones_registradas' => count($historico),
            'sesiones' => $historico,
            'ultima_actualizacion' => Carbon::parse($sesiones->last()->created_at)->diffForHumans()
        ]);
    }
}
