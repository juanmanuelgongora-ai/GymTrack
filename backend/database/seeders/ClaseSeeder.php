<?php

namespace Database\Seeders;

use App\Models\Clase;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $entrenadores = User::where('rol', 'entrenador')->get();

        if ($entrenadores->isEmpty()) {
            return;
        }

        $clases = [
            [
                'nombre' => 'CrossFit Avanzado',
                'instructor_id' => $entrenadores->random()->id,
                'sala' => 'Sala A',
                'horario_inicio' => '08:00',
                'horario_fin' => '09:30',
                'capacidad_max' => 20,
                'color' => '#ff8c42',
                'estado' => 'programada',
            ],
            [
                'nombre' => 'Yoga Restaurativo',
                'instructor_id' => $entrenadores->random()->id,
                'sala' => 'Sala Zen',
                'horario_inicio' => '10:00',
                'horario_fin' => '11:00',
                'capacidad_max' => 15,
                'color' => '#2ecc71',
                'estado' => 'programada',
            ],
            [
                'nombre' => 'Spinning HIIT',
                'instructor_id' => $entrenadores->random()->id,
                'sala' => 'Sala Ciclo',
                'horario_inicio' => '12:00',
                'horario_fin' => '13:30',
                'capacidad_max' => 25,
                'color' => '#3498db',
                'estado' => 'programada',
            ],
        ];

        foreach ($clases as $clase) {
            Clase::create($clase);
        }
    }
}
