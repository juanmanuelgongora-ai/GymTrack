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
        Schema::create('ejercicio_favoritos', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->uuid('ejercicio_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('ejercicio_id')->references('id')->on('ejercicios')->onDelete('cascade');

            $table->unique(['user_id', 'ejercicio_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ejercicio_favoritos');
    }
};
