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
        Schema::table('entrenadores', function (Blueprint $row) {
            $row->string('certificado_path')->nullable()->after('certificacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entrenadores', function (Blueprint $row) {
            $row->dropColumn('certificado_path');
        });
    }
};
