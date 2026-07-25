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
        Schema::create('transacciones', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Relación con el cliente (opcional por si es una transacción no ligada a cliente, aunque la historia dice miembro)
            $table->foreignUuid('cliente_id')->nullable()->constrained('clientes')->onDelete('set null');

            $table->string('concepto');
            $table->decimal('monto', 10, 2);
            $table->string('metodo_pago'); // tarjeta, paypal, efectivo
            $table->enum('estado', ['completado', 'pendiente', 'rechazado'])->default('pendiente');

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transacciones');
    }
};
