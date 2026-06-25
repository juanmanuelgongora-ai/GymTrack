<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Entrenador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminUserController extends Controller
{
    /**
     * List all users with their associated profiles.
     */
    public function index()
    {
        $users = User::with(['cliente', 'entrenador'])
            ->whereIn('rol', ['cliente', 'entrenador'])
            ->get();
        return response()->json($users);
    }

    /**
     * Create a new user (Client or Trainer) from the admin panel.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'rol' => 'required|in:entrenador,cliente',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'id' => (string) Str::uuid(),
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'email' => $request->email,
                'password_hash' => Hash::make($request->password),
                'rol' => $request->rol,
                'activo' => true
            ]);

            if ($request->rol === 'cliente') {
                Cliente::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id
                ]);
            } else if ($request->rol === 'entrenador') {
                Entrenador::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id,
                    'especialidad' => 'General',
                    'experiencia_anios' => 0
                ]);
            }

            // Llamar al microservicio de notificaciones (Registro por Administrador)
            try {
                Http::post(env('MICROSERVICIO_NOTIFICACIONES_URL', 'http://localhost:3005') . '/api/notificar-registro', [
                    'email' => $user->email,
                    'nombre' => $user->nombre,
                    'rol' => $user->rol
                ]);
            } catch (\Exception $e) {
                \Log::error("Error llamando al microservicio de notificaciones: " . $e->getMessage());
            }

            return response()->json($user->load(['cliente', 'entrenador']), 201);
        });
    }

    /**
     * Toggle user active status (Deactivate/Activate).
     */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        // Prevent self-deactivation if security is needed, but for now just toggle
        $user->activo = !$user->activo;
        $user->save();

        return response()->json([
            'message' => $user->activo ? 'Usuario activado exitosamente' : 'Usuario desactivado exitosamente',
            'user' => $user
        ]);
    }
}
