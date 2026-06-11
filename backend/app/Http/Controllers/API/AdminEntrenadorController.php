<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Entrenador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AdminEntrenadorController extends Controller
{
    /**
     * List all pending trainer requests.
     */
    public function getPending()
    {
        $entrenadores = Entrenador::with('user')
            ->where('estado', 'pendiente')
            ->get();

        return response()->json($entrenadores);
    }

    /**
     * Approve a trainer.
     */
    public function approve($id)
    {
        $entrenador = Entrenador::findOrFail($id);

        $entrenador->estado = 'aprobado';
        $entrenador->motivo_rechazo = null;
        $entrenador->save();

        // Si se aprueba, nos aseguramos que el usuario asociado esté activo
        if ($entrenador->user) {
            $entrenador->user->activo = true;
            $entrenador->user->save();

            try {
                Mail::raw("¡Felicidades {$entrenador->user->nombre}! Tu solicitud para unirte al equipo de Coachs en GymTrack ha sido APROBADA.\n\nYa puedes ingresar a la plataforma con tu correo y contraseña, y configurar tu panel de entrenador.\n\n¡Bienvenido al equipo!", function ($message) use ($entrenador) {
                    $message->to($entrenador->user->email)
                        ->subject('✅ Solicitud Aprobada - Bienvenido a GymTrack');
                });
            } catch (\Exception $e) {
                \Log::error('Error enviando correo de aprobación: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Entrenador aprobado exitosamente.',
            'entrenador' => $entrenador->load('user')
        ]);
    }

    /**
     * Reject a trainer with a reason.
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'motivo' => 'required|string|max:1000'
        ]);

        $entrenador = Entrenador::findOrFail($id);

        $entrenador->estado = 'rechazado';
        $entrenador->motivo_rechazo = $request->motivo;
        $entrenador->save();

        if ($entrenador->user) {
            try {
                Mail::raw("Hola {$entrenador->user->nombre},\n\nLamentamos informarte que tu solicitud para entrenar en GymTrack ha sido RECHAZADA en esta ocasión.\n\nMotivo proporcionado por administración:\n\"{$request->motivo}\"\n\nGracias por tu interés en formar parte de nuestro equipo.", function ($message) use ($entrenador) {
                    $message->to($entrenador->user->email)
                        ->subject('❌ Actualización sobre tu solicitud en GymTrack');
                });
            } catch (\Exception $e) {
                \Log::error('Error enviando correo de rechazo: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Solicitud de entrenador rechazada.',
            'entrenador' => $entrenador->load('user')
        ]);
    }

    /**
     * Download the certificate for the trainer
     */
    public function downloadCertificado($id)
    {
        $entrenador = Entrenador::findOrFail($id);

        if (!$entrenador->certificado_path) {
            return response()->json(['message' => 'No hay certificado adjunto'], 404);
        }

        $path = storage_path('app/public/' . $entrenador->certificado_path);

        if (!file_exists($path)) {
            return response()->json(['message' => 'El archivo no existe en el disco'], 404);
        }

        return response()->download($path);
    }
}
