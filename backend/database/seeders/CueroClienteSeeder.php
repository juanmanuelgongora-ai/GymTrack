<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CueroClienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Crear o actualizar el usuario (sin borrar nada)
        $user = User::updateOrCreate(
            ['email' => 'cuero@gmail.com'],
            [
                'nombre' => 'Cliente',
                'apellido' => 'Cuero',
                'password_hash' => Hash::make('123456789'),
                'rol' => 'cliente',
                'activo' => 1,
                'created_at' => now(),
            ]
        );

        // 2. Crear o actualizar el perfil de cliente ligado al usuario
        Cliente::updateOrCreate(
            ['user_id' => $user->id],
            [
                'edad' => 25,
                'sexo' => 'Masculino',
                'peso' => 80.5,
                'estatura' => 178,
                'objetivo_principal' => 'Ganancia de masa muscular',
                'nivel_actividad' => 'Intermedio',
                'created_at' => now(),
            ]
        );

        $this->command->info('Cliente "cuero@gmail.com" creado/actualizado con éxito sin afectar otros datos.');
    }
}
