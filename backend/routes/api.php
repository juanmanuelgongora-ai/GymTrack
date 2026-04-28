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

Route::post('/register', [AuthController::class , 'register']);
Route::post('/login', [AuthController::class , 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class , 'logout']);
    Route::get('/user', function (Request $request) {
            return $request->user()->load('cliente');
        }
        );

        // Logros
        Route::get('/logros', [LogroController::class, 'index']);
        Route::get('/logros/recientes', [LogroController::class, 'recentlyUnlocked']);

        // Perfil completo: usuario + datos de cliente
        Route::get('/me/perfil', [\App\Http\Controllers\API\ProfileController::class, 'show']);
        Route::put('/me/perfil', [\App\Http\Controllers\API\ProfileController::class, 'update']);
        Route::post('/me/perfil/foto', [\App\Http\Controllers\API\ProfileController::class, 'updatePhoto']);

        // Métricas corporales
        Route::get('/metricas', [MetricaController::class , 'index']);
        Route::get('/metricas/latest', [MetricaController::class , 'latest']);
        Route::post('/metricas', [MetricaController::class , 'store']);

        // Hitos físicos
        Route::get('/hitos', [HitoController::class , 'index']);
        Route::post('/hitos', [HitoController::class , 'store']);
        Route::put('/hitos/{id}', [HitoController::class , 'update']);
        Route::delete('/hitos/{id}', [HitoController::class , 'destroy']);

        // Rutinas AI
        Route::post('/rutinas/generar', [RutinaController::class , 'generarRutinaInicial']);
        Route::get('/rutinas/latest', [RutinaController::class , 'getLatestRoutine']);

        // Entrenamientos (Sesiones reales)
        Route::post('/entrenamientos/registrar', [EntrenamientoController::class, 'registrar']);
        Route::get('/entrenamientos/stats', [EntrenamientoController::class, 'stats']);

        // Ejercicios
        Route::get('/ejercicios', [EjercicioController::class , 'index']);
        Route::post('/ejercicios/{ejercicio}/toggle-favorito', [EjercicioController::class , 'toggleFavorito']);
    });
