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
        Schema::table('ejercicios', function (Blueprint $table) {
            $table->string('musculos_secundarios')->nullable()->after('grupo_muscular');
            $table->string('tiempo_descanso')->nullable()->after('reps_sugeridas');
        });
    }

    public function down(): void
    {
        Schema::table('ejercicios', function (Blueprint $table) {
            $table->dropColumn(['musculos_secundarios', 'tiempo_descanso']);
        });
    }
};
