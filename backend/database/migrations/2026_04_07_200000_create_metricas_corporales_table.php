<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('metricas_corporales', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->date('fecha');
            $table->float('peso_kg')->nullable();
            $table->float('altura_cm')->nullable();
            $table->float('imc')->nullable();
            $table->float('grasa_corporal')->nullable();
            $table->float('masa_muscular')->nullable();
            $table->float('pecho_cm')->nullable();
            $table->float('cintura_cm')->nullable();
            $table->float('cadera_cm')->nullable();
            $table->float('brazo_cm')->nullable();
            $table->float('muslo_cm')->nullable();
            $table->text('notas')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('metricas_corporales');
    }
};
