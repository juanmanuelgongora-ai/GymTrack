<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Transaccion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PagoController extends Controller
{
    public function renovarMembresia(Request $request)
    {
        $request->validate([
            'plan_nombre' => 'required|string',
            'meses' => 'required|integer|min:1',
            'monto' => 'required|numeric',
            'metodo_pago' => 'required|string',
            'detalles_pago' => 'nullable|array'
        ]);

        $user = $request->user();

        if ($user->rol !== 'cliente') {
            return response()->json(['message' => 'Solo los clientes pueden renovar membresía.'], 403);
        }

        $cliente = $user->cliente;

        // Actualizar fecha de vencimiento
        // Si ya está vencida, empezamos desde hoy. Si no, sumamos al vencimiento actual.
        $fechaBase = ($cliente->vencimiento_membresia && $cliente->vencimiento_membresia->isFuture())
            ? $cliente->vencimiento_membresia
            : Carbon::now();

        $cliente->vencimiento_membresia = $fechaBase->addMonths($request->meses);
        $cliente->save();

        // Registrar la transacción
        Transaccion::create([
            'id' => (string) Str::uuid(),
            'cliente_id' => $cliente->id,
            'monto' => $request->monto,
            'metodo_pago' => $request->metodo_pago,
            'estado' => 'Completado',
            'concepto' => "Renovación: " . $request->plan_nombre,
            'fecha' => Carbon::now()
        ]);

        return response()->json([
            'message' => 'Membresía renovada exitosamente.',
            'vencimiento_membresia' => $cliente->vencimiento_membresia,
            'user' => $user->load('cliente')
        ]);
    }
}
