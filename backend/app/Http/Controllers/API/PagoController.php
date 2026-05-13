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

        $detalles = $request->detalles_pago;
        $estado = 'completado';
        $mensajeExito = 'Membresía renovada exitosamente.';

        // Lógica de simulación del Gateway
        if ($request->metodo_pago === 'tarjeta') {
            // Simulamos rechazo si el CVV es 000
            if (isset($detalles['cvv']) && $detalles['cvv'] === '000') {
                $estado = 'rechazado';
            }
        } elseif ($request->metodo_pago === 'transferencia') {
            $estado = 'pendiente';
            $mensajeExito = 'Transferencia recibida. Tu membresía se activará una vez validado el pago.';
        }

        if ($estado === 'rechazado') {
            // Guardamos la transacción rechazada
            $transaccion = Transaccion::create([
                'id' => (string) Str::uuid(),
                'cliente_id' => $cliente->id,
                'monto' => $request->monto,
                'metodo_pago' => $request->metodo_pago,
                'estado' => 'rechazado',
                'concepto' => "Renovación: " . $request->plan_nombre,
                'fecha' => Carbon::now()
            ]);

            return response()->json([
                'message' => 'Transacción rechazada por el banco. Por favor verifica tus fondos o intenta con otra tarjeta.',
                'transaccion' => $transaccion
            ], 400);
        }

        // Si es completado, actualizamos membresía
        if ($estado === 'completado') {
            $fechaBase = ($cliente->vencimiento_membresia && $cliente->vencimiento_membresia->isFuture())
                ? $cliente->vencimiento_membresia
                : Carbon::now();

            $cliente->vencimiento_membresia = $fechaBase->addMonths($request->meses);
            $cliente->save();
        }

        // Registrar la transacción
        $transaccion = Transaccion::create([
            'id' => (string) Str::uuid(),
            'cliente_id' => $cliente->id,
            'monto' => $request->monto,
            'metodo_pago' => $request->metodo_pago,
            'estado' => $estado,
            'concepto' => "Renovación: " . $request->plan_nombre,
            'fecha' => Carbon::now()
        ]);

        return response()->json([
            'message' => $mensajeExito,
            'vencimiento_membresia' => $cliente->vencimiento_membresia,
            'user' => $user->load('cliente'),
            'transaccion' => $transaccion
        ]);
    }
}
