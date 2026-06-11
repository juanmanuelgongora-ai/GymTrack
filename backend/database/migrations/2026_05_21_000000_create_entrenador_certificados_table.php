<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('entrenador_certificados', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('entrenador_id')->constrained('entrenadores')->cascadeOnDelete();
            $table->string('titulo');
            $table->string('path');
            $table->string('emisor')->nullable();
            $table->date('fecha_obtencion')->nullable();
            $table->date('fecha_expiracion')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entrenador_certificados');
    }
};
