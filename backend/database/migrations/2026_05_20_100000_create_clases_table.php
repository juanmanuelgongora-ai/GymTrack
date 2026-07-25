<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clases', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->foreignUuid('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->string('sala');
            $table->time('horario_inicio');
            $table->time('horario_fin');
            $table->integer('capacidad_max')->default(20);
            $table->string('color')->default('#ff8c42');
            $table->enum('estado', ['programada', 'en progreso', 'completa'])->default('programada');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clases');
    }
};
