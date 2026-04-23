<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ejercicios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre');
            $table->string('grupo_muscular'); // Pecho, Espalda, Piernas, Hombros, Brazos, Core
            $table->string('dificultad'); // Principiante, Intermedio, Avanzado
            $table->string('equipamiento')->nullable();
            $table->text('descripcion')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('series_sugeridas')->default(3);
            $table->string('reps_sugeridas')->default('10-12');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ejercicios');
    }
};
