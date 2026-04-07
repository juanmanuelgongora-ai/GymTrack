<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Hito;
use Illuminate\Http\Request;

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
            'tipo' => 'required|in:peso,fuerza,hipertrofia,habito,resistencia',
            'meta_valor' => 'required|numeric|min:0.1',
            'valor_actual' => 'nullable|numeric|min:0',
            'unidad' => 'required|string|max:30',
            'fecha_limite' => 'nullable|date|after:today',
        ]);

        $cliente = Cliente::where('user_id', $request->user()->id)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Perfil de cliente no encontrado.'], 404);
        }

        $valorActual = $request->valor_actual ?? 0;
        $metaValor = $request->meta_valor;
        $progreso = $metaValor > 0 ? min(100, round(($valorActual / $metaValor) * 100)) : 0;

        $hito = Hito::create([
            'cliente_id' => $cliente->id,
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'tipo' => $request->tipo,
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
            'valor_actual' => 'nullable|numeric|min:0',
            'estado' => 'nullable|in:en_progreso,completado,abandonado',
            'fecha_limite' => 'nullable|date',
        ]);

        if ($request->has('titulo'))
            $hito->titulo = $request->titulo;
        if ($request->has('descripcion'))
            $hito->descripcion = $request->descripcion;
        if ($request->has('fecha_limite'))
            $hito->fecha_limite = $request->fecha_limite;

        if ($request->has('valor_actual')) {
            $hito->valor_actual = $request->valor_actual;
            $hito->progreso_porcentaje = $hito->meta_valor > 0
                ? min(100, round(($request->valor_actual / $hito->meta_valor) * 100))
                : 0;

            // Auto-complete if progress reaches 100%
            if ($hito->progreso_porcentaje >= 100) {
                $hito->estado = 'completado';
            }
        }

        if ($request->has('estado')) {
            $hito->estado = $request->estado;
        }

        $hito->save();

        return response()->json($hito);
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
}
