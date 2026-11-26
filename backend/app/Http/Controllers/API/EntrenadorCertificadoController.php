<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Entrenador;
use App\Models\EntrenadorCertificado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EntrenadorCertificadoController extends Controller
{
    /**
     * List certificates for the authenticated trainer.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->entrenador) {
            return response()->json(['message' => 'No eres un entrenador'], 403);
        }

        $certificados = $user->entrenador->certificados()->orderBy('created_at', 'desc')->get();
        return response()->json($certificados);
    }

    /**
     * Store a new certificate.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'emisor' => 'nullable|string|max:255',
            'fecha_obtencion' => 'nullable|date',
            'fecha_expiracion' => 'nullable|date',
            'archivo' => 'required|file|mimes:pdf,jpg,png,jpeg|max:2048'
        ]);

        $user = $request->user();
        if (!$user->entrenador) {
            return response()->json(['message' => 'No eres un entrenador'], 403);
        }

        $path = null;
        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('certificados', $filename, 'public');
        }

        $certificado = EntrenadorCertificado::create([
            'entrenador_id' => $user->entrenador->id,
            'titulo' => $request->titulo,
            'emisor' => $request->emisor,
            'fecha_obtencion' => $request->fecha_obtencion,
            'fecha_expiracion' => $request->fecha_expiracion,
            'path' => $path
        ]);

        return response()->json($certificado, 201);
    }

    /**
     * Delete a certificate.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $certificado = EntrenadorCertificado::findOrFail($id);

        if ($certificado->entrenador_id !== $user->entrenador->id) {
            return response()->json(['message' => 'No tienes permiso para eliminar este certificado'], 403);
        }

        if ($certificado->path) {
            Storage::disk('public')->delete($certificado->path);
        }

        $certificado->delete();

        return response()->json(['message' => 'Certificado eliminado exitosamente']);
    }

    /**
     * Download a certificate.
     */
    public function download(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->entrenador) {
            return response()->json(['message' => 'No eres un entrenador'], 403);
        }

        $certificado = EntrenadorCertificado::findOrFail($id);

        if ($certificado->entrenador_id !== $user->entrenador->id) {
            return response()->json(['message' => 'No tienes permiso para descargar este certificado'], 403);
        }

        if (!$certificado->path) {
            return response()->json(['message' => 'No hay archivo adjunto'], 404);
        }

        $path = storage_path('app/public/' . $certificado->path);

        if (!file_exists($path)) {
            return response()->json(['message' => 'El archivo no existe en el disco'], 404);
        }

        return response()->download($path);
    }
}
