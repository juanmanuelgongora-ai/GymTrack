<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Clase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Clase::with('instructor:id,nombre,apellido');

        // If trainer, only show their classes
        if (Auth::user()->rol === 'entrenador') {
            $query->where('instructor_id', Auth::id());
        }

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Auth::user()->rol !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'instructor_id' => 'required|exists:users,id',
            'sala' => 'required|string|max:255',
            'horario_inicio' => 'required',
            'horario_fin' => 'required',
            'capacidad_max' => 'required|integer',
            'color' => 'nullable|string',
        ]);

        $clase = Clase::create($validated);

        return response()->json($clase, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $clase = Clase::findOrFail($id);

        if (Auth::user()->rol !== 'admin' && Auth::id() !== $clase->instructor_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $clase->update($request->all());

        return response()->json($clase);
    }

    /**
     * Update only the status (Trainer check-in).
     */
    public function updateStatus(Request $request, $id)
    {
        $clase = Clase::findOrFail($id);

        if (Auth::id() !== $clase->instructor_id && Auth::user()->rol !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'estado' => 'required|in:programada,en progreso,completa'
        ]);

        $clase->update(['estado' => $validated['estado']]);

        return response()->json($clase);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (Auth::user()->rol !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $clase = Clase::findOrFail($id);
        $clase->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
