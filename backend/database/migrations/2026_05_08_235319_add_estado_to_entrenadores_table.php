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
        Schema::table('entrenadores', function (Blueprint $table) {
            $table->string('estado')->default('pendiente');
            $table->text('motivo_rechazo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entrenadores', function (Blueprint $table) {
            $table->dropColumn(['estado', 'motivo_rechazo']);
        });
    }
};
