<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\MetricaController;
use App\Http\Controllers\API\HitoController;
use App\Http\Controllers\API\RutinaController;
use App\Http\Controllers\API\EjercicioController;
use App\Http\Controllers\API\EntrenamientoController;

use App\Http\Controllers\API\LogroController;
use App\Http\Controllers\API\AdminUserController;
use App\Http\Controllers\API\AdminEntrenadorController;
use App\Http\Controllers\API\TransaccionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get(
        '/user',
        function (Request $request) {
            return $request->user()->load('cliente');
        }
    );

    // Logros
    Route::get('/logros', [LogroController::class, 'index']);
    Route::get('/logros/recientes', [LogroController::class, 'recentlyUnlocked']);

    // Perfil completo: usuario + datos de cliente/entrenador
    Route::get('/me/perfil', [\App\Http\Controllers\API\ProfileController::class, 'show']);
    Route::put('/me/perfil', [\App\Http\Controllers\API\ProfileController::class, 'update']);
    Route::post('/me/perfil/foto', [\App\Http\Controllers\API\ProfileController::class, 'updatePhoto']);

    // Métricas corporales
    Route::get('/metricas', [MetricaController::class, 'index']);
    Route::get('/metricas/latest', [MetricaController::class, 'latest']);
    Route::post('/metricas', [MetricaController::class, 'store']);

    // Hitos físicos
    Route::get('/hitos', [HitoController::class, 'index']);
    Route::post('/hitos', [HitoController::class, 'store']);
    Route::put('/hitos/{id}', [HitoController::class, 'update']);
    Route::delete('/hitos/{id}', [HitoController::class, 'destroy']);

    // Rutinas AI
    Route::post('/rutinas/generar', [RutinaController::class, 'generarRutinaInicial']);
    Route::get('/rutinas/latest', [RutinaController::class, 'getLatestRoutine']);
    Route::post('/rutinas/sync-progress', [RutinaController::class, 'syncProgress']);
    Route::get('/rutinas/{rutinaId}/progress', [RutinaController::class, 'getProgress']);

    // Entrenamientos (Sesiones reales)
    Route::post('/entrenamientos/registrar', [EntrenamientoController::class, 'registrar']);
    Route::get('/entrenamientos/stats', [EntrenamientoController::class, 'stats']);

    // Transacciones
    Route::get('/transacciones', [TransaccionController::class, 'index']);
    Route::put('/transacciones/{id}/aprobar', [TransaccionController::class, 'aprobar']);

    // Ejercicios
    Route::get('/ejercicios', [EjercicioController::class, 'index']);
    Route::post('/ejercicios/{ejercicio}/toggle-favorito', [EjercicioController::class, 'toggleFavorito']);

    // Entrenador Dashboard Stats
    Route::get('/entrenador/dashboard', function (Request $request) {
        $clientes = \App\Models\User::where('rol', 'cliente')->where('activo', 1)->get();
        $ingresos = $clientes->count() * 100000; // Simular $100.000 por cliente usando clientes reales
        return response()->json([
            'ingresos_mes' => $ingresos,
            'clientes_activos' => $clientes->count(),
            'clases_pendientes' => rand(2, 8),
            'retencion' => 95,
            'nuevos_clientes' => $clientes->sortByDesc('created_at')->take(3)->map(function ($c) {
                return [
                    'id' => $c->id,
                    'name' => trim($c->nombre . ' ' . $c->apellido),
                    'goal' => 'Mejorar condición',
                    'joined' => $c->created_at->diffForHumans()
                ];
            })->values()
        ]);
    });

    // Entrenador: Gestión de Clientes (Consultar todos los clientes activos como proxy de mis clientes)
    Route::get('/entrenador/clientes', function (Request $request) {
        $clientes = \App\Models\User::where('rol', 'cliente')->where('activo', 1)->with(['cliente.metricas', 'cliente.hitos'])->get();
        return response()->json($clientes->map(function ($user) {
            $clienteInfo = $user->cliente;
            $healthInfo = $clienteInfo && $clienteInfo->condicion_medica
                ? json_decode($clienteInfo->condicion_medica, true)
                : [];

            $sesiones = \App\Models\SesionEntrenamiento::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();

            return [
                'id' => $user->id,
                'name' => trim($user->nombre . ' ' . $user->apellido) ?: 'Usuario sin nombre',
                'email' => $user->email,
                'age' => $clienteInfo && $clienteInfo->fecha_nacimiento ? \Carbon\Carbon::parse($clienteInfo->fecha_nacimiento)->age : '--',
                'plan' => 'Básico', // Plan por defecto si no hay modelo de pago
                'healthInfo' => [
                    'condiciones_medicas' => $healthInfo['estado_general'] ?? 'Ninguna registrada',
                    'lesiones_activas' => $healthInfo['lesiones'] ?? 'Ninguna registrada',
                    'restricciones_movimiento' => $healthInfo['restricciones_movimiento'] ?? 'Ninguna registrada',
                    'objetivos_acordados' => $clienteInfo->objetivo_principal ?? 'Ninguno registrado'
                ],
                'metricas' => $clienteInfo && $clienteInfo->metricas ? $clienteInfo->metricas->sortByDesc('fecha')->values()->all() : [],
                'objetivos' => $clienteInfo && $clienteInfo->hitos ? $clienteInfo->hitos->all() : [],
                'sesiones' => $sesiones->all()
            ];
        }));
    });

    Route::put('/entrenador/clientes/{id}/health', function (Request $request, $id) {
        $user = \App\Models\User::findOrFail($id);
        $cliente = $user->cliente;
        if ($cliente) {
            $currentHealth = $cliente->condicion_medica ? json_decode($cliente->condicion_medica, true) : [];
            $currentHealth['estado_general'] = $request->input('condiciones_medicas');
            $currentHealth['lesiones'] = $request->input('lesiones_activas');
            $currentHealth['restricciones_movimiento'] = $request->input('restricciones_movimiento');

            $cliente->condicion_medica = json_encode($currentHealth);
            $cliente->objetivo_principal = $request->input('objetivos_acordados');
            $cliente->save();
        }
        return response()->json(['success' => true]);
    });

    // Entrenador: Estadísticas de Desempeño
    Route::get('/entrenador/estadisticas', function (Request $request) {
        $clientes = \App\Models\User::where('rol', 'cliente')->where('activo', 1)->get();
        $nuevosClientes = \App\Models\User::where('rol', 'cliente')->where('activo', 1)
                            ->whereMonth('created_at', \Carbon\Carbon::now()->month)
                            ->count();
        
        $sesionesImpartidas = $clientes->count() * rand(3, 6);
        $horasTotales = round($sesionesImpartidas * 1.5) + rand(10, 30);

        return response()->json([
            'racha_dias' => rand(8, 20),
            'sesiones_mes' => $sesionesImpartidas,
            'nuevos_clientes' => $nuevosClientes,
            'horas_totales' => $horasTotales,
            'satisfaccion' => [
                'promedio' => 4.8,
                'total_valoraciones' => $clientes->count() * 2,
                'desglose' => [
                    'excelente' => floor($clientes->count() * 1.5),
                    'bueno' => floor($clientes->count() * 0.4),
                    'regular' => floor($clientes->count() * 0.1)
                ]
            ],
            'actividad_semanal' => [
                ['d' => 'L', 'h' => rand(50, 100)],
                ['d' => 'M', 'h' => rand(50, 100)],
                ['d' => 'X', 'h' => rand(50, 100)],
                ['d' => 'J', 'h' => rand(50, 100)],
                ['d' => 'V', 'h' => rand(50, 100)],
                ['d' => 'S', 'h' => rand(20, 80)],
                ['d' => 'D', 'h' => rand(0, 30)]
            ],
            'tipos_entrenamiento' => [
                ['nombre' => 'Fuerza', 'porcentaje' => 35, 'color' => '#ff4d4d'],
                ['nombre' => 'Cardio', 'porcentaje' => 25, 'color' => '#22c55e'],
                ['nombre' => 'Funcional', 'porcentaje' => 20, 'color' => '#3b82f6'],
                ['nombre' => 'Movilidad', 'porcentaje' => 15, 'color' => '#a855f7'],
                ['nombre' => 'Otros', 'porcentaje' => 5, 'color' => '#64748b']
            ]
        ]);
    });

    // Admin: Gestión de Usuarios
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users', [AdminUserController::class, 'store']);
    Route::patch('/admin/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);

    // Admin: Gestión de Entrenadores
    Route::get('/admin/entrenadores/pendientes', [AdminEntrenadorController::class, 'getPending']);
    Route::post('/admin/entrenadores/{id}/aprobar', [AdminEntrenadorController::class, 'approve']);
    Route::post('/admin/entrenadores/{id}/rechazar', [AdminEntrenadorController::class, 'reject']);
    Route::get('/admin/entrenadores/{id}/certificado', [AdminEntrenadorController::class, 'downloadCertificado']);

    // Admin: Transacciones (GT-59)
    Route::get('/admin/transacciones', [\App\Http\Controllers\API\TransaccionController::class, 'index']);

    // --- Renovación de Membresía ---
    Route::post('/membresia/renovar', [\App\Http\Controllers\API\PagoController::class, 'renovarMembresia']);
});
