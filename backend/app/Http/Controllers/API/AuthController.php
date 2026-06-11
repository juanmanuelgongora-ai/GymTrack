<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Entrenador;
use App\Models\EntrenadorCertificado;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http;

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
            'activo' => ($request->rol === 'entrenador') ? false : true,
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
            } elseif (in_array($request->frecuencia, ['5 o más'])) {
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
                'nivel_actividad' => $nivelActividad,
                'condicion_medica' => $request->condicion_medica,
                'vencimiento_membresia' => Carbon::now()->addMonth(), // Default 1 month
                'activo' => true
            ]);
        } else if ($user->rol === 'entrenador') {
            $certificadoPath = null;
            if ($request->hasFile('certificacion_archivo')) {
                $file = $request->file('certificacion_archivo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $certificadoPath = $file->storeAs('certificados', $filename, 'public');
            }

            $entrenador = Entrenador::create([
                'user_id' => $user->id,
                'especialidad' => $request->especialidad,
                'experiencia_anios' => $request->experiencia,
                'certificacion' => $request->certificacion,
                'certificado_path' => $certificadoPath,
                'horarios' => is_string($request->horarios) ? json_decode($request->horarios, true) : $request->horarios,
                'tipos_entrenamiento' => is_string($request->tipos_entrenamiento) ? json_decode($request->tipos_entrenamiento, true) : $request->tipos_entrenamiento,
                'capacidad_maxima' => $request->capacidad_maxima,
                'objetivos_profesionales' => $request->objetivos,
                'estado' => 'pendiente',
                'edad' => $request->edad,
                'genero' => $request->genero,
                'contacto' => $request->contacto,
                'direccion' => $request->direccion,
                'emergencia' => $request->emergencia
            ]);

            if ($certificadoPath) {
                EntrenadorCertificado::create([
                    'entrenador_id' => $entrenador->id,
                    'titulo' => $request->certificacion ?? 'Certificado inicial',
                    'path' => $certificadoPath,
                    'emisor' => 'Pendiente', // Could be added to registration form later
                    'fecha_obtencion' => now()
                ]);
            }
        }

        // Llamar al microservicio de notificaciones (Registro Público)
        try {
            \Illuminate\Support\Facades\Http::post(env('MICROSERVICIO_NOTIFICACIONES_URL', 'http://localhost:3005') . '/api/notificar-registro', [
                'email' => $user->email,
                'nombre' => $user->nombre,
                'rol' => $user->rol
            ]);
        } catch (\Exception $e) {
            \Log::error("Error llamando al microservicio de notificaciones: " . $e->getMessage());
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

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Verificamos si el usuario no ha sido aprobado (inactivo), 
        // pero permitimos que los administradores entren siempre
        if (!$user->activo && $user->rol !== 'admin') {
            throw ValidationException::withMessages([
                'email' => ['Tu cuenta no está activa. Si eres entrenador, espera a que el administrador apruebe tu solicitud.'],
            ]);
        }

        if ($user->rol === 'cliente') {
            $user->load('cliente');
            $user->membresia_activa = $user->cliente->vencimiento_membresia ? $user->cliente->vencimiento_membresia->isFuture() : false;
        } elseif ($user->rol === 'entrenador') {
            $user->load('entrenador');
        }
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'membresia_activa' => $user->rol === 'cliente' ? (bool) $user->membresia_activa : true
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
