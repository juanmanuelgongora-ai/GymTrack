<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('hitos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->enum('tipo', ['peso', 'fuerza', 'hipertrofia', 'habito', 'resistencia']);
            $table->float('meta_valor');
            $table->float('valor_actual')->default(0);
            $table->string('unidad'); // kg, rep, sesiones, km, etc.
            $table->integer('progreso_porcentaje')->default(0);
            $table->enum('estado', ['en_progreso', 'completado', 'abandonado'])->default('en_progreso');
            $table->date('fecha_limite')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hitos');
    }
};
