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

        $user = $request->user();
        $ejercicios = $query->get()->map(function ($ex) use ($user) {
            $ex->is_favorito = $user ? $user->favoritos()->where('ejercicio_id', $ex->id)->exists() : false;
            return $ex;
        });

        return response()->json([
            'ejercicios' => $ejercicios
        ]);
    }

    public function toggleFavorito(Request $request, Ejercicio $ejercicio)
    {
        $user = $request->user();
        $isFavorito = $user->favoritos()->toggle($ejercicio->id);

        return response()->json([
            'status' => 'success',
            'is_favorito' => count($isFavorito['attached']) > 0
        ]);
    }
}
