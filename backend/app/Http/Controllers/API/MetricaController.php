<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\MetricaCorporal;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MetricaController extends Controller
{
    /**
     * Listar historial de métricas del cliente autenticado.
     */
    public function index(Request $request)
    {
        $cliente = Cliente::where('user_id', $request->user()->id)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Perfil de cliente no encontrado.'], 404);
        }

        $metricas = MetricaCorporal::where('cliente_id', $cliente->id)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json($metricas);
    }

    /**
     * Obtener la última medición del cliente.
     */
    public function latest(Request $request)
    {
        $cliente = Cliente::where('user_id', $request->user()->id)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Perfil de cliente no encontrado.'], 404);
        }

        $metrica = MetricaCorporal::where('cliente_id', $cliente->id)
            ->orderBy('fecha', 'desc')
            ->first();

        if (!$metrica) {
            // Return initial data from clientes table
            return response()->json([
                'peso_kg' => $cliente->peso_kg,
                'altura_cm' => $cliente->altura_cm,
                'imc' => $cliente->imc,
                'fecha' => $cliente->created_at,
                'from_registro' => true
            ]);
        }

        return response()->json($metrica);
    }

    /**
     * Registrar una nueva medición corporal.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'nullable|date',
            'peso_kg' => 'nullable|numeric|min:20|max:300',
            'altura_cm' => 'nullable|numeric|min:100|max:250',
            'grasa_corporal' => 'nullable|numeric|min:1|max:60',
            'masa_muscular' => 'nullable|numeric|min:10|max:120',
            'pecho_cm' => 'nullable|numeric|min:50|max:200',
            'cintura_cm' => 'nullable|numeric|min:40|max:200',
            'cadera_cm' => 'nullable|numeric|min:50|max:200',
            'brazo_cm' => 'nullable|numeric|min:15|max:60',
            'muslo_cm' => 'nullable|numeric|min:30|max:100',
            'notas' => 'nullable|string|max:500',
        ]);

        $cliente = Cliente::where('user_id', $request->user()->id)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Perfil de cliente no encontrado.'], 404);
        }

        // Calculate IMC if both weight and height are provided
        $imc = null;
        $pesoKg = $request->peso_kg;
        $alturaCm = $request->altura_cm ?? $cliente->altura_cm;

        if ($pesoKg && $alturaCm) {
            $alturaMetros = $alturaCm / 100;
            if ($alturaMetros > 0) {
                $imc = round($pesoKg / ($alturaMetros * $alturaMetros), 2);
            }
        }

        $metrica = MetricaCorporal::create([
            'cliente_id' => $cliente->id,
            'fecha' => $request->fecha ?? Carbon::now()->format('Y-m-d'),
            'peso_kg' => $pesoKg,
            'altura_cm' => $alturaCm,
            'imc' => $imc,
            'grasa_corporal' => $request->grasa_corporal,
            'masa_muscular' => $request->masa_muscular,
            'pecho_cm' => $request->pecho_cm,
            'cintura_cm' => $request->cintura_cm,
            'cadera_cm' => $request->cadera_cm,
            'brazo_cm' => $request->brazo_cm,
            'muslo_cm' => $request->muslo_cm,
            'notas' => $request->notas,
        ]);

        // Update latest values in clientes table
        if ($pesoKg)
            $cliente->peso_kg = $pesoKg;
        if ($request->altura_cm)
            $cliente->altura_cm = $request->altura_cm;
        if ($imc)
            $cliente->imc = $imc;
        $cliente->save();

        return response()->json($metrica, 201);
    }
}
