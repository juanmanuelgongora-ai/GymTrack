<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaccion;
use Illuminate\Http\Request;

class TransaccionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaccion::with(['cliente.user'])
            ->orderBy('created_at', 'desc');

        if ($request->has('estado') && in_array($request->estado, ['completado', 'pendiente', 'rechazado'])) {
            $query->where('estado', $request->estado);
        }

        $transacciones = $query->take(10)->get()->map(function ($tx) {
            return [
                'id' => $tx->id,
                'name' => $tx->cliente && $tx->cliente->user
                    ? $tx->cliente->user->nombre . ' ' . $tx->cliente->user->apellido
                    : 'Gasto Operativo',
                'concepto' => $tx->concepto,
                'monto' => $tx->monto,
                'metodo' => $tx->metodo_pago,
                'fecha' => $tx->created_at->format('d/m/Y'),
                'estado' => ucfirst($tx->estado),
                'initial' => $tx->cliente && $tx->cliente->user
                    ? strtoupper(substr($tx->cliente->user->nombre, 0, 1) . substr($tx->cliente->user->apellido, 0, 1))
                    : 'GO'
            ];
        });

        return response()->json($transacciones);
    }
}
