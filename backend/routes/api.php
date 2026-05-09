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

    // Ejercicios
    Route::get('/ejercicios', [EjercicioController::class, 'index']);
    Route::post('/ejercicios/{ejercicio}/toggle-favorito', [EjercicioController::class, 'toggleFavorito']);

    // Admin: Gestión de Usuarios
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users', [AdminUserController::class, 'store']);
    Route::patch('/admin/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);

    // Admin: Gestión de Entrenadores
    Route::get('/admin/entrenadores/pendientes', [AdminEntrenadorController::class, 'getPending']);
    Route::post('/admin/entrenadores/{id}/aprobar', [AdminEntrenadorController::class, 'approve']);
    Route::post('/admin/entrenadores/{id}/rechazar', [AdminEntrenadorController::class, 'reject']);
    Route::get('/admin/entrenadores/{id}/certificado', [AdminEntrenadorController::class, 'downloadCertificado']);
});
