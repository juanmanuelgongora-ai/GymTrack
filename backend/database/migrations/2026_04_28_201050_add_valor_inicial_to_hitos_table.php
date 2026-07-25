<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hitos', function (Blueprint $table) {
            if (!Schema::hasColumn('hitos', 'valor_inicial')) {
                $table->float('valor_inicial')->default(0)->after('tipo');
            }
            // Cambiar el enum por string para mayor flexibilidad con nuevas categorías
            $table->string('tipo')->change();
        });
    }

    public function down(): void
    {
        Schema::table('hitos', function (Blueprint $table) {
            $table->dropColumn('valor_inicial');
            // No podemos revertir fácilmente a enum si ya hay datos de nuevas categorías
        });
    }
};
