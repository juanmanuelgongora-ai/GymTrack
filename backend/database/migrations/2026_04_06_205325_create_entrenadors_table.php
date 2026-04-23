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
        Schema::create('entrenadores', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            
            $table->string('especialidad')->nullable();
            $table->integer('experiencia_anios')->nullable();
            $table->string('certificacion')->nullable();
            $table->json('horarios')->nullable();
            $table->json('tipos_entrenamiento')->nullable();
            $table->integer('capacidad_maxima')->nullable();
            $table->text('objetivos_profesionales')->nullable();

            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrenadores');
    }
};
