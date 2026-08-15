<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logros', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre');
            $table->string('descripcion');
            $table->string('icono'); // Identificador de Lucide icon o clase CSS
            $table->string('categoria'); // racha, record, objetivo, social
            $table->integer('meta_valor'); // Valor a alcanzar (ej: 7 para racha de 7 días)
            $table->integer('puntos')->default(10);
            $table->timestamps();
        });

        Schema::create('logro_usuario', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('logro_id')->constrained('logros')->cascadeOnDelete();
            $table->timestamp('fecha_obtencion');
            $table->timestamps();

            $table->unique(['user_id', 'logro_id']);
        });

        // Insertar logros básicos
        $logros = [
            [
                'id' => Str::uuid(),
                'nombre' => 'Primer Paso',
                'descripcion' => 'Completa tu primer entrenamiento',
                'icono' => 'Zap',
                'categoria' => 'entrenamiento',
                'meta_valor' => 1,
                'puntos' => 50
            ],
            [
                'id' => Str::uuid(),
                'nombre' => 'Constancia Inicial',
                'descripcion' => 'Entrena 3 días seguidos',
                'icono' => 'Flame',
                'categoria' => 'racha',
                'meta_valor' => 3,
                'puntos' => 100
            ],
            [
                'id' => Str::uuid(),
                'nombre' => 'Racha de Fuego',
                'descripcion' => 'Entrena 7 días seguidos',
                'icono' => 'Flame',
                'categoria' => 'racha',
                'meta_valor' => 7,
                'puntos' => 250
            ],
            [
                'id' => Str::uuid(),
                'nombre' => 'Disciplina Total',
                'descripcion' => 'Entrena 30 días seguidos',
                'icono' => 'Trophy',
                'categoria' => 'racha',
                'meta_valor' => 30,
                'puntos' => 1000
            ],
            [
                'id' => Str::uuid(),
                'nombre' => 'Superando Límites',
                'descripcion' => 'Completa un hito de fuerza',
                'icono' => 'TrendingUp',
                'categoria' => 'fuerza',
                'meta_valor' => 1,
                'puntos' => 200
            ],
            [
                'id' => Str::uuid(),
                'nombre' => 'Cuerpo en Cambio',
                'descripcion' => 'Actualiza tus métricas 5 veces',
                'icono' => 'Activity',
                'categoria' => 'metricas',
                'meta_valor' => 5,
                'puntos' => 150
            ]
        ];

        foreach ($logros as $logro) {
            DB::table('logros')->insert($logro);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('logro_usuario');
        Schema::dropIfExists('logros');
    }
};
