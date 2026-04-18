<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Ejercicio;
use Illuminate\Http\Request;

class EjercicioController extends Controller
{
    public function index(Request $request)
    {
        $query = Ejercicio::query();

        // Filter by Search Name
        if ($request->has('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%');
        }

        // Filter by Muscle Group
        if ($request->has('grupo_muscular') && $request->grupo_muscular !== 'Todas') {
            $query->where('grupo_muscular', $request->grupo_muscular);
        }

        // Filter by Difficulty Level
        if ($request->has('dificultad') && $request->dificultad !== 'Cualquier Nivel') {
            $query->where('dificultad', $request->dificultad);
        }

        $ejercicios = $query->get();

        return response()->json([
            'ejercicios' => $ejercicios
        ]);
    }
}
