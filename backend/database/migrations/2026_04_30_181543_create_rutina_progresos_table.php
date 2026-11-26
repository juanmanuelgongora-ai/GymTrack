<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rutina_progresos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('rutina_id');
            $table->json('progreso_json')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('rutina_id')->references('id')->on('rutinas')->onDelete('cascade');
            $table->unique(['user_id', 'rutina_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rutina_progresos');
    }
};
