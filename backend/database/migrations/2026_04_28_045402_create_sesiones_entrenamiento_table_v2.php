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
        Schema::dropIfExists('sesiones_entrenamiento');
        Schema::create('sesiones_entrenamiento', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('rutina_id')->nullable()->constrained('rutinas')->nullOnDelete();
            $table->string('dia_rutina');
            $table->integer('duracion_minutos');
            $table->json('detalles_sesion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sesiones_entrenamiento');
    }
};
