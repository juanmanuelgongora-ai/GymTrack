<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Hito;
use App\Services\AchievementService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HitoController extends Controller
{
    /**
     * Listar hitos del cliente autenticado con filtros opcionales.
     */
    public function index(Request $request)
    {
        $cliente = Cliente::where('user_id', $request->user()->id)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Perfil de cliente no encontrado.'], 404);
        }

        $query = Hito::where('cliente_id', $cliente->id);

        // Filtrar por tipo si se envía
        if ($request->has('tipo') && $request->tipo) {
            $query->where('tipo', $request->tipo);
        }

        // Filtrar por estado si se envía
        if ($request->has('estado') && $request->estado) {
            $query->where('estado', $request->estado);
        }

        $hitos = $query->orderBy('created_at', 'desc')->get();

        // ---- GT-55: Contar sesiones para cada hito ----
        $sesiones = \App\Models\SesionEntrenamiento::where('user_id', $request->user()->id)->get();

        foreach ($hitos as $hito) {
            $count = 0;
            $tituloBuscado = strtolower($hito->titulo);

            foreach ($sesiones as $sesion) {
                $detalles = $sesion->detalles_sesion;
                if (!$detalles)
                    continue;

                $encontradoEnSesion = false;
                foreach ($detalles as $nameOrId => $progreso) {
                    if (str_contains(strtolower($nameOrId), $tituloBuscado)) {
                        // Verificamos si tiene al menos un set con peso
                        if (isset($progreso['completedSets']) && is_array($progreso['completedSets'])) {
                            foreach ($progreso['completedSets'] as $set) {
                                if (isset($set['peso']) && (float) $set['peso'] > 0) {
                                    $encontradoEnSesion = true;
                                    break;
                                }
                            }
                        }
                    }
                    if ($encontradoEnSesion)
                        break;
                }
                if ($encontradoEnSesion)
                    $count++;
            }
            $hito->registros_count = $count;
        }
        // -----------------------------------------------

        return response()->json($hitos);
    }

    /**
     * Crear un nuevo hito.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:500',
            'tipo' => 'required|string', // peso, fuerza, hipertrofia, habito, resistencia, composicion
            'meta_valor' => 'required|numeric',
            'valor_inicial' => 'nullable|numeric',
            'valor_actual' => 'nullable|numeric',
            'unidad' => 'required|string|max:30',
            'fecha_limite' => 'nullable|date',
        ]);

        $cliente = Cliente::where('user_id', $request->user()->id)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Perfil de cliente no encontrado.'], 404);
        }

        $valorInicial = $request->valor_inicial ?? 0;
        $valorActual = $request->valor_actual ?? $valorInicial;
        $metaValor = $request->meta_valor;

        $denominador = $metaValor - $valorInicial;
        $progreso = 0;

        if ($denominador != 0) {
            $progreso = min(100, max(0, round((($valorActual - $valorInicial) / $denominador) * 100)));
        }

        $hito = Hito::create([
            'cliente_id' => $cliente->id,
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'tipo' => $request->tipo,
            'valor_inicial' => $valorInicial,
            'meta_valor' => $metaValor,
            'valor_actual' => $valorActual,
            'unidad' => $request->unidad,
            'progreso_porcentaje' => $progreso,
            'estado' => 'en_progreso',
            'fecha_limite' => $request->fecha_limite,
        ]);

        return response()->json($hito, 201);
    }

    /**
     * Actualizar progreso de un hito.
     */
    public function update(Request $request, $id)
    {
        $cliente = Cliente::where('user_id', $request->user()->id)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Perfil de cliente no encontrado.'], 404);
        }

        $hito = Hito::where('id', $id)->where('cliente_id', $cliente->id)->first();

        if (!$hito) {
            return response()->json(['message' => 'Hito no encontrado.'], 404);
        }

        $request->validate([
            'titulo' => 'nullable|string|max:150',
            'descripcion' => 'nullable|string|max:500',
            'valor_actual' => 'nullable|numeric',
            'meta_valor' => 'nullable|numeric',
            'estado' => 'nullable|in:en_progreso,completado,abandonado',
            'fecha_limite' => 'nullable|date',
        ]);

        if ($request->has('titulo'))
            $hito->titulo = $request->titulo;
        if ($request->has('descripcion'))
            $hito->descripcion = $request->descripcion;
        if ($request->has('fecha_limite'))
            $hito->fecha_limite = $request->fecha_limite;
        if ($request->has('meta_valor'))
            $hito->meta_valor = $request->meta_valor;

        if ($request->has('valor_actual')) {
            $hito->valor_actual = $request->valor_actual;
        }

        // Recalcular progreso
        $denominador = $hito->meta_valor - $hito->valor_inicial;
        if ($denominador != 0) {
            $hito->progreso_porcentaje = min(100, max(0, round((($hito->valor_actual - $hito->valor_inicial) / $denominador) * 100)));
        } else {
            $hito->progreso_porcentaje = $hito->valor_actual >= $hito->meta_valor ? 100 : 0;
        }

        if ($hito->progreso_porcentaje >= 100) {
            if ($hito->estado !== 'completado') {
                Log::info("Hito completado automáticamente: {$hito->id} - {$hito->titulo}");
                $hito->estado = 'completado';
            }
        }

        if ($request->has('estado')) {
            $oldEstado = $hito->estado;
            $hito->estado = $request->estado;
            if ($hito->estado === 'completado' && $oldEstado !== 'completado') {
                Log::info("Hito marcado como completado manualmente: {$hito->id} - {$hito->titulo}");
            }
        }

        $hito->save();

        // Verificar logros si el hito está completado
        $logrosDesbloqueados = [];
        if ($hito->estado === 'completado') {
            $logrosDesbloqueados = AchievementService::checkHitoAchievements($request->user());
        }

        return response()->json([
            'hito' => $hito,
            'logros_desbloqueados' => $logrosDesbloqueados
        ]);
    }

    /**
     * Eliminar un hito.
     */
    public function destroy(Request $request, $id)
    {
        $cliente = Cliente::where('user_id', $request->user()->id)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Perfil de cliente no encontrado.'], 404);
        }

        $hito = Hito::where('id', $id)->where('cliente_id', $cliente->id)->first();

        if (!$hito) {
            return response()->json(['message' => 'Hito no encontrado.'], 404);
        }

        $hito->delete();

        return response()->json(['message' => 'Hito eliminado correctamente.']);
    }

    public function historial(Request $request, $id)
    {
        $cliente = Cliente::where('user_id', $request->user()->id)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Perfil de cliente no encontrado.'], 404);
        }

        $hito = Hito::where('id', $id)->where('cliente_id', $cliente->id)->first();

        if (!$hito) {
            return response()->json(['message' => 'Hito no encontrado.'], 404);
        }

        // 1. Buscar sesiones reales en la tabla de entrenamientos
        $realSessions = \App\Models\SesionEntrenamiento::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'asc')
            ->get();

        $historicoReal = [];
        $ejercicioBuscado = strtolower($hito->titulo);

        foreach ($realSessions as $sesion) {
            $detalles = $sesion->detalles_sesion;
            if (!$detalles)
                continue;

            $maxPesoEnSesion = 0;
            $encontrado = false;

            // Buscar el ejercicio en el JSON de la sesión
            foreach ($detalles as $nameOrId => $progreso) {
                if (str_contains(strtolower($nameOrId), $ejercicioBuscado)) {
                    if (isset($progreso['completedSets']) && is_array($progreso['completedSets'])) {
                        foreach ($progreso['completedSets'] as $set) {
                            if (isset($set['peso'])) {
                                $maxPesoEnSesion = max($maxPesoEnSesion, (float) $set['peso']);
                                $encontrado = true;
                            }
                        }
                    }
                }
            }

            if ($encontrado && $maxPesoEnSesion > 0) {
                $historicoReal[] = [
                    'label' => 'Sesión ' . (count($historicoReal) + 1),
                    'fecha' => Carbon::parse($sesion->created_at)->format('d/m'),
                    'peso' => $maxPesoEnSesion,
                    'variacion' => count($historicoReal) > 0 ? (round($maxPesoEnSesion - end($historicoReal)['peso'], 1)) . ' kg' : '+0',
                    'progreso' => $hito->meta_valor > 0 ? min(100, round(($maxPesoEnSesion / $hito->meta_valor) * 100)) : 0,
                ];
            }
        }

        // 2. Si no hay datos reales, mantenemos la simulación para que no aparezca vacío
        if (empty($historicoReal)) {
            $inicial = $hito->valor_inicial ?? 0;
            $actual = $hito->valor_actual ?? $inicial;
            $meta = $hito->meta_valor ?? $actual;
            $totalPoints = 5;
            $diff = $actual - $inicial;

            for ($index = 0; $index < $totalPoints; $index++) {
                $factor = $totalPoints > 1 ? $index / ($totalPoints - 1) : 1;
                $peso = round($inicial + ($diff * $factor), 1);
                $fecha = Carbon::parse($hito->created_at)->addDays($index * 7)->format('d/m');
                $previous = $index === 0 ? $inicial : round($inicial + ($diff * (($index - 1) / ($totalPoints - 1))), 1);
                $historicoReal[] = [
                    'label' => 'Semana ' . ($index + 1),
                    'fecha' => $fecha,
                    'peso' => $peso,
                    'variacion' => ($index === 0 ? '+0' : (round($peso - $previous, 1)) . ' kg'),
                    'progreso' => $meta > 0 ? min(100, round(($peso / $meta) * 100)) : 0,
                ];
            }
        }

        $meta = $hito->meta_valor;
        $actual = !empty($historicoReal) ? end($historicoReal)['peso'] : ($hito->valor_actual ?: 0);
        $maximo = !empty($historicoReal) ? max(array_column($historicoReal, 'peso')) : $actual;

        return response()->json([
            'hito' => $hito,
            'ejercicio' => $hito->titulo,
            'objetivo' => $meta,
            'actual' => $actual,
            'progreso' => $hito->progreso_porcentaje,
            'maximo' => $maximo,
            'sesiones' => $historicoReal,
        ]);
    }
}
