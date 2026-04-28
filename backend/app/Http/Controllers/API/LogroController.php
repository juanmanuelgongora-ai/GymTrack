<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Logro;
use App\Models\LogroUsuario;
use Illuminate\Http\Request;

class LogroController extends Controller
{
    /**
     * Obtener todos los logros disponibles y marcar los obtenidos por el usuario.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $logrosObtenidos = LogroUsuario::where('user_id', $user->id)
            ->pluck('logro_id')
            ->toArray();

        $allLogros = Logro::orderBy('puntos', 'asc')->get()->map(function($logro) use ($logrosObtenidos) {
            $logro->obtenido = in_array($logro->id, $logrosObtenidos);
            if ($logro->obtenido) {
                $pivot = LogroUsuario::where('user_id', auth()->id())
                    ->where('logro_id', $logro->id)
                    ->first();
                $logro->fecha_obtencion = $pivot->fecha_obtencion;
            }
            return $logro;
        });

        return response()->json($allLogros);
    }

    /**
     * Obtener solo los logros desbloqueados recientemente (para notificaciones).
     */
    public function recentlyUnlocked(Request $request)
    {
        $user = $request->user();
        $since = $request->query('since', now()->subMinutes(5));

        $unlocked = LogroUsuario::with('logro')
            ->where('user_id', $user->id)
            ->where('fecha_obtencion', '>=', $since)
            ->get()
            ->pluck('logro');

        return response()->json($unlocked);
    }
}
