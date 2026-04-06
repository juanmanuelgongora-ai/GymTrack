<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            // Lo hacemos nullable temporalmente por si aún no escoge gimnasio al registrarse
            $table->uuid('gimnasio_id')->nullable();

            $table->date('fecha_nacimiento')->nullable();
            $table->string('genero')->nullable(); // Guardaremos 'M' o 'F'
            $table->float('peso_kg')->nullable();
            $table->float('altura_cm')->nullable();
            $table->float('imc')->nullable();
            $table->string('nivel_actividad')->nullable();
            $table->string('objetivo_principal')->nullable();
            $table->text('condicion_medica')->nullable();
            $table->boolean('activo')->default(true);

            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
