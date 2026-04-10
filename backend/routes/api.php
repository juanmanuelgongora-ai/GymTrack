<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\MetricaController;
use App\Http\Controllers\API\HitoController;
use App\Http\Controllers\API\RutinaController;

Route::post('/register', [AuthController::class , 'register']);
Route::post('/login', [AuthController::class , 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class , 'logout']);
    Route::get('/user', function (Request $request) {
            return $request->user()->load('cliente');
        }
        );

        // Perfil completo: usuario + datos de cliente
        Route::get('/me/perfil', function (Request $request) {
            $user = $request->user();
            $cliente = \App\Models\Cliente::where('user_id', $user->id)->first();
            return response()->json([
            'user' => $user,
            'cliente' => $cliente,
            ]);
        }
        );

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
    });
