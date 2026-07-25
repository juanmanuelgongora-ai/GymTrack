<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Cliente;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        if ($user->rol === 'cliente') {
            $user->load('cliente');
        } elseif ($user->rol === 'entrenador') {
            $user->load('entrenador');
        }
        
        return response()->json([
            'user' => $user,
            'cliente' => $user->cliente,
            'entrenador' => $user->entrenador
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'nullable|string|max:100',
            'ubicacion' => 'nullable|string|max:255',
            'gimnasio_id' => 'nullable|uuid',
            'peso_kg' => 'nullable|numeric',
            'altura_cm' => 'nullable|numeric',
            'genero' => 'nullable|string|in:M,F,Otro',
            'fecha_nacimiento' => 'nullable|date',
        ]);

        $user->update([
            'nombre' => $request->nombre,
            'apellido' => $request->apellido ?? $user->apellido,
        ]);

        if ($user->rol === 'cliente') {
            $clienteData = [
                'ubicacion' => $request->ubicacion,
                'gimnasio_id' => $request->gimnasio_id,
                'peso_kg' => $request->peso_kg,
                'altura_cm' => $request->altura_cm,
                'genero' => $request->genero,
                'fecha_nacimiento' => $request->fecha_nacimiento,
            ];

            // Recalculate IMC if possible
            if ($request->filled('peso_kg') && $request->filled('altura_cm')) {
                $alturaMetros = $request->altura_cm / 100;
                if ($alturaMetros > 0) {
                    $clienteData['imc'] = round($request->peso_kg / ($alturaMetros * $alturaMetros), 2);
                }
            }

            $user->cliente()->update($clienteData);
        }

        $user->refresh();
        $user->load('cliente');

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('foto')) {
            // Delete old photo if exists
            if ($user->foto_url) {
                // If it's a full URL, we need to extract the path
                // For simplicity, we assume it's stored in 'public' disk
                $oldPath = str_replace(Storage::url(''), '', $user->foto_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('foto')->store('profiles', 'public');
            $user->foto_url = Storage::url($path);
            $user->save();

            return response()->json([
                'message' => 'Foto de perfil actualizada',
                'foto_url' => $user->foto_url,
                'user' => $user->load('cliente')
            ]);
        }

        return response()->json(['message' => 'No se subió ninguna imagen'], 400);
    }
}
