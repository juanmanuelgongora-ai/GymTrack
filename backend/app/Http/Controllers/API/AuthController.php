<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Entrenador;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:6',
            'rol' => 'nullable|in:admin,entrenador,cliente',
        ]);

        $user = User::create([
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'email' => $request->email,
            'password_hash' => Hash::make($request->password),
            'rol' => $request->rol ?? 'cliente',
        ]);

        if ($user->rol === 'cliente') {
            // Calculate a dummy birth date from age if present
            $fechaNacimiento = null;
            if ($request->filled('edad') && is_numeric($request->edad)) {
                $fechaNacimiento = Carbon::now()->subYears($request->edad)->format('Y-m-d');
            }

            // Calculate basic IMC if peso and estatura are present
            $imc = null;
            if ($request->filled('peso_kg') && $request->filled('altura_cm')) {
                $alturaMetros = $request->altura_cm / 100;
                if ($alturaMetros > 0) {
                    $imc = round($request->peso_kg / ($alturaMetros * $alturaMetros), 2);
                }
            }

            $nivelActividad = 'Principiante';
            if (in_array($request->frecuencia, ['3-4 veces'])) {
                $nivelActividad = 'Intermedio';
            }
            elseif (in_array($request->frecuencia, ['5 o más'])) {
                $nivelActividad = 'Avanzado';
            }

            Cliente::create([
                'user_id' => $user->id,
                'fecha_nacimiento' => $fechaNacimiento,
                'genero' => $request->genero,
                'peso_kg' => $request->peso_kg,
                'altura_cm' => $request->altura_cm,
                'imc' => $imc,
                'objetivo_principal' => $request->objetivo_principal,
                'nivel_actividad' => $nivelActividad
            ]);
        }
        else if ($user->rol === 'entrenador') {
            Entrenador::create([
                'user_id' => $user->id,
                'especialidad' => $request->especialidad,
                'experiencia_anios' => $request->experiencia,
                'certificacion' => $request->certificacion,
                'horarios' => $request->horarios,
                'tipos_entrenamiento' => $request->tipos_entrenamiento,
                'capacidad_maxima' => $request->capacidad_maxima,
                'objetivos_profesionales' => $request->objetivos
            ]);
        }

        if ($user->rol === 'cliente') {
            $user->load('cliente');
        } elseif ($user->rol === 'entrenador') {
            $user->load('entrenador');
        }
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        // Validamos la contraseña contra el hash de la BD
        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        if ($user->rol === 'cliente') {
            $user->load('cliente');
        } elseif ($user->rol === 'entrenador') {
            $user->load('entrenador');
        }
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente.'
        ]);
    }
}
