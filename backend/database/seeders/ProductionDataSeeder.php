<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use Illuminate\Support\Facades\DB;

class ProductionDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        Cliente::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $users = array (
  0 => 
  array (
    'id' => '019dd61b-a028-73e0-8b41-195c9d834c65',
    'nombre' => 'Angela',
    'apellido' => 'Garcia',
    'email' => 'angela@gmail.com',
    'password_hash' => '$2y$12$9BrzLXla3YgLo8Hyb/mYN.eT/ax1l97IhVAgIHfNL6K/4eqeKYT4G',
    'rol' => 'cliente',
    'activo' => 1,
    'foto_url' => NULL,
    'created_at' => '2026-04-28 17:00:27',
  ),
  1 => 
  array (
    'id' => '019de65f-3cc6-727e-a757-6f7daab15728',
    'nombre' => 'Test',
    'apellido' => 'User',
    'email' => 'testuser123@example.com',
    'password_hash' => '$2y$12$uSPVyQXYtrciaY/hmUld3OCWuHbf74MbIl8ZNym8Olk.3EGJMGjTi',
    'rol' => 'cliente',
    'activo' => 1,
    'foto_url' => NULL,
    'created_at' => '2026-05-01 20:48:14',
  ),
  2 => 
  array (
    'id' => '019de679-db4e-72e8-b804-18b63c47f160',
    'nombre' => 'Juan',
    'apellido' => 'Manuel Gongora',
    'email' => 'juanmanuelgongora457@gmail.com',
    'password_hash' => '$2y$12$MwGPsXjaXqrRF8bNTZL1EOEHP7MjfjUnJfus.i.WWqGpctOVmr/FC',
    'rol' => 'cliente',
    'activo' => 1,
    'foto_url' => NULL,
    'created_at' => '2026-05-01 21:17:18',
  ),
  3 => 
  array (
    'id' => '019de8d0-c582-70b8-9e0e-3a4b974986c7',
    'nombre' => 'Admin',
    'apellido' => 'General',
    'email' => 'admin@gymtrack.com',
    'password_hash' => '$2y$12$f3lBZ941ZPEuRyInN6vFLeCExBu07v40y0kBHJOixw1ltfeLZnkSO',
    'rol' => 'admin',
    'activo' => 1,
    'foto_url' => NULL,
    'created_at' => '2026-05-02 08:11:29',
  ),
  4 => 
  array (
    'id' => '019e0a2c-eb32-739f-bbdb-23f942dd97d1',
    'nombre' => 'Diego',
    'apellido' => 'Fernando Diaz',
    'email' => 'diegofdiaz402@gmail.com',
    'password_hash' => '$2y$12$OF97BgqrPuFUuYOHTRwbCO.770VAqfxR6hZSI/2QE8i6SMK8XqgYm',
    'rol' => 'cliente',
    'activo' => 1,
    'foto_url' => NULL,
    'created_at' => '2026-05-08 19:39:36',
  ),
  5 => 
  array (
    'id' => '019e0a5b-7501-732b-a179-6b4b33c6dd9f',
    'nombre' => 'Sant',
    'apellido' => '.',
    'email' => 'owz7ewygqd@wnbaldwy.com',
    'password_hash' => '$2y$12$6tzLlrYZlGPJiqh/uMimVeuvQb2XlpGOHPZJfj0qZfjVUa4dnd73G',
    'rol' => 'cliente',
    'activo' => 1,
    'foto_url' => NULL,
    'created_at' => '2026-05-08 20:30:26',
  ),
  6 => 
  array (
    'id' => '7f2f9d12-64c7-4cb2-b4d0-09c1ff6d2b89',
    'nombre' => 'Nuevo',
    'apellido' => 'Usuario',
    'email' => 'nuevo@gymtrack.com',
    'password_hash' => '$2y$12$KYDfvOryaP5L291fuYxO/.Vc9GIf5S1cEAoTo.FQo9wYeJuWgY7be',
    'rol' => 'cliente',
    'activo' => 0,
    'foto_url' => NULL,
    'created_at' => '2026-05-03 08:13:11',
  ),
  7 => 
  array (
    'id' => 'e6ed92ad-c0d9-4cbf-ad8d-6b7fe7b84dee',
    'nombre' => 'prueba',
    'apellido' => 'jsjs',
    'email' => 'prueba@gmail.com',
    'password_hash' => '$2y$12$vtHN6ufWjm1pDsKDGLGo2ujuujIz8/LN6wRDdHFYhe6thdBpSiOVK',
    'rol' => 'cliente',
    'activo' => 1,
    'foto_url' => NULL,
    'created_at' => '2026-05-06 19:23:16',
  ),
  8 => 
  array (
    'id' => 'f8766bb5-9bb7-4f9c-b8ed-c1d05d9e512e',
    'nombre' => 'Juan Manuel',
    'apellido' => 'Gongora Gongora',
    'email' => 'juanmanuelgongora@gmail.com',
    'password_hash' => '$2y$12$UmpmFtX0L6eGFBYOYEI7tOIwXbK8vAFiffH8U.mk5y.aOs21LOMcy',
    'rol' => 'cliente',
    'activo' => 0,
    'foto_url' => NULL,
    'created_at' => '2026-05-05 14:36:01',
  ),
);
        foreach ($users as $user) {
            User::create($user);
        }

        $clientes = array (
  0 => 
  array (
    'id' => '019dd61b-a041-71cf-bf48-3cd22a12dcc6',
    'user_id' => '019dd61b-a028-73e0-8b41-195c9d834c65',
    'gimnasio_id' => NULL,
    'ubicacion' => NULL,
    'fecha_nacimiento' => '2009-04-28',
    'genero' => 'F',
    'peso_kg' => 60.0,
    'altura_cm' => 156.0,
    'imc' => 24.65,
    'nivel_actividad' => 'Intermedio',
    'objetivo_principal' => 'Ganar masa muscular',
    'condicion_medica' => '{"salud":"Excelente","cirugia":"No","medicamentos":"No","condiciones":["Ninguna"],"lesion":"Asma","sueno":"7-8"}',
    'activo' => 1,
    'created_at' => '2026-04-28 17:00:27',
  ),
  1 => 
  array (
    'id' => '019de65f-3cf3-7379-9690-797438dd4a49',
    'user_id' => '019de65f-3cc6-727e-a757-6f7daab15728',
    'gimnasio_id' => NULL,
    'ubicacion' => NULL,
    'fecha_nacimiento' => '2001-05-02',
    'genero' => 'F',
    'peso_kg' => 70.0,
    'altura_cm' => 175.0,
    'imc' => 22.86,
    'nivel_actividad' => 'Intermedio',
    'objetivo_principal' => 'Bajar de peso',
    'condicion_medica' => '{"salud":"Excelente","cirugia":"No","medicamentos":"No","condiciones":["Ninguna"],"lesion":"No","sueno":"7-8"}',
    'activo' => 1,
    'created_at' => '2026-05-01 20:48:14',
  ),
  2 => 
  array (
    'id' => '019de679-db5d-7336-8cb3-647ee2708d0d',
    'user_id' => '019de679-db4e-72e8-b804-18b63c47f160',
    'gimnasio_id' => NULL,
    'ubicacion' => NULL,
    'fecha_nacimiento' => '2006-05-02',
    'genero' => 'M',
    'peso_kg' => 50.0,
    'altura_cm' => 165.0,
    'imc' => 18.37,
    'nivel_actividad' => 'Principiante',
    'objetivo_principal' => 'Ganar masa muscular',
    'condicion_medica' => '{"salud":"Regular","cirugia":"No","medicamentos":"No","condiciones":["Presión arterial baja"],"lesion":"Lesión en los ligamentos de la pierna derecha","sueno":"7-8"}',
    'activo' => 1,
    'created_at' => '2026-05-01 21:17:18',
  ),
  3 => 
  array (
    'id' => '019e0a2c-eb47-7031-b10e-7fcbde679de9',
    'user_id' => '019e0a2c-eb32-739f-bbdb-23f942dd97d1',
    'gimnasio_id' => NULL,
    'ubicacion' => NULL,
    'fecha_nacimiento' => '2004-05-09',
    'genero' => 'M',
    'peso_kg' => 63.0,
    'altura_cm' => 169.0,
    'imc' => 22.06,
    'nivel_actividad' => 'Intermedio',
    'objetivo_principal' => 'Ganar masa muscular',
    'condicion_medica' => '{"salud":"Malo","cirugia":"No","medicamentos":"No","condiciones":["Presión arterial baja"],"lesion":"dolor en el hombro ","sueno":"5-6"}',
    'activo' => 1,
    'created_at' => '2026-05-08 19:39:36',
  ),
  4 => 
  array (
    'id' => '019e0a5b-751e-7336-810e-540b35dd9809',
    'user_id' => '019e0a5b-7501-732b-a179-6b4b33c6dd9f',
    'gimnasio_id' => NULL,
    'ubicacion' => NULL,
    'fecha_nacimiento' => '2002-05-09',
    'genero' => 'M',
    'peso_kg' => 67.0,
    'altura_cm' => 180.0,
    'imc' => 20.68,
    'nivel_actividad' => 'Avanzado',
    'objetivo_principal' => 'Ganar masa muscular',
    'condicion_medica' => '{"salud":"Excelente","cirugia":"No","medicamentos":"No","condiciones":["Ninguna"],"lesion":"No","sueno":"7-8"}',
    'activo' => 1,
    'created_at' => '2026-05-08 20:30:26',
  ),
  5 => 
  array (
    'id' => '573c2027-30ca-470a-b77a-52fae42f9b89',
    'user_id' => 'f8766bb5-9bb7-4f9c-b8ed-c1d05d9e512e',
    'gimnasio_id' => NULL,
    'ubicacion' => NULL,
    'fecha_nacimiento' => NULL,
    'genero' => NULL,
    'peso_kg' => NULL,
    'altura_cm' => NULL,
    'imc' => NULL,
    'nivel_actividad' => NULL,
    'objetivo_principal' => NULL,
    'condicion_medica' => NULL,
    'activo' => 1,
    'created_at' => '2026-05-05 14:36:01',
  ),
  6 => 
  array (
    'id' => '5c17742d-334a-4f18-87f1-e110386bf7dd',
    'user_id' => 'e6ed92ad-c0d9-4cbf-ad8d-6b7fe7b84dee',
    'gimnasio_id' => NULL,
    'ubicacion' => NULL,
    'fecha_nacimiento' => NULL,
    'genero' => NULL,
    'peso_kg' => NULL,
    'altura_cm' => NULL,
    'imc' => NULL,
    'nivel_actividad' => NULL,
    'objetivo_principal' => NULL,
    'condicion_medica' => NULL,
    'activo' => 1,
    'created_at' => '2026-05-06 19:23:16',
  ),
  7 => 
  array (
    'id' => 'c1c18833-e3b1-44f0-b055-65413fa256bc',
    'user_id' => '7f2f9d12-64c7-4cb2-b4d0-09c1ff6d2b89',
    'gimnasio_id' => NULL,
    'ubicacion' => NULL,
    'fecha_nacimiento' => NULL,
    'genero' => NULL,
    'peso_kg' => NULL,
    'altura_cm' => NULL,
    'imc' => NULL,
    'nivel_actividad' => NULL,
    'objetivo_principal' => NULL,
    'condicion_medica' => NULL,
    'activo' => 1,
    'created_at' => '2026-05-03 08:13:11',
  ),
);
        foreach ($clientes as $cliente) {
            Cliente::create($cliente);
        }
    }
}
