<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransaccionSeeder extends Seeder
{
    public function run(): void
    {
        $clienteId = \App\Models\Cliente::first()?->id;

        $transacciones = [
            ['concepto' => 'Membresía Premium', 'monto' => 120000.00, 'metodo_pago' => 'Tarjeta', 'estado' => 'completado'],
            ['concepto' => 'Membresía Premium', 'monto' => 120000.00, 'metodo_pago' => 'Transferencia', 'estado' => 'completado'],
            ['concepto' => 'Clase Personal - Yoga', 'monto' => 45000.00, 'metodo_pago' => 'Efectivo', 'estado' => 'completado'],
            ['concepto' => 'Membresía Básica', 'monto' => 60000.00, 'metodo_pago' => 'Tarjeta', 'estado' => 'completado'],
            ['concepto' => 'Renovación Membresía', 'monto' => 60000.00, 'metodo_pago' => 'PayPal', 'estado' => 'completado'],
            ['concepto' => 'Clase Grupal - HIIT', 'monto' => 25000.00, 'metodo_pago' => 'Tarjeta', 'estado' => 'pendiente'],
            ['concepto' => 'Suplementos Proteína', 'monto' => 150000.00, 'metodo_pago' => 'Tarjeta', 'estado' => 'rechazado'],
            ['concepto' => 'Membresía Premium', 'monto' => 120000.00, 'metodo_pago' => 'Transferencia', 'estado' => 'pendiente'],
            ['concepto' => 'Entrenamiento Funcional', 'monto' => 50000.00, 'metodo_pago' => 'Efectivo', 'estado' => 'completado'],
            ['concepto' => 'Membresía Básica', 'monto' => 60000.00, 'metodo_pago' => 'PayPal', 'estado' => 'rechazado'],
        ];

        foreach ($transacciones as $tx) {
            \App\Models\Transaccion::create(array_merge($tx, [
                'cliente_id' => $clienteId,
                'created_at' => now()->subDays(rand(0, 30))
            ]));
        }
    }
}
