<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ejercicio;

class EjercicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Ejercicio::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $ejercicios = [
            // PECHO
            [
                'nombre' => 'Press de Banca',
                'grupo_muscular' => 'Pecho',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Barra, Banco',
                'descripcion' => 'Ejercicio básico para el desarrollo del pectoral mayor.',
                'video_url' => 'https://www.youtube.com/embed/TAH8RxOS0VI',
                'series_sugeridas' => 4,
                'reps_sugeridas' => '8-10'
            ],
            [
                'nombre' => 'Press Inclinado',
                'grupo_muscular' => 'Pecho',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Mancuernas, Banco Incl.',
                'descripcion' => 'Enfoca la parte superior del pectoral.',
                'video_url' => 'https://www.youtube.com/embed/HzkHpIIo4IA',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '10-12'
            ],
            [
                'nombre' => 'Aperturas',
                'grupo_muscular' => 'Pecho',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Mancuernas, Banco',
                'descripcion' => 'Ejercicio de aislamiento para el pectoral.',
                'video_url' => 'https://www.youtube.com/embed/eozdVDA78K0',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12-15'
            ],
            [
                'nombre' => 'Flexiones',
                'grupo_muscular' => 'Pecho',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Ninguno',
                'descripcion' => 'Ejercicio de peso corporal para pectoral y tríceps.',
                'video_url' => 'https://www.youtube.com/embed/oZQlr-lYc5Q',
                'series_sugeridas' => 3,
                'reps_sugeridas' => 'Al fallo'
            ],
            [
                'nombre' => 'Cruce de Poleas',
                'grupo_muscular' => 'Pecho',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Poleas',
                'descripcion' => 'Trabajo de tensión constante para el pectoral.',
                'video_url' => 'https://www.youtube.com/embed/34DK36aLhNg',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12-15'
            ],

            // ESPALDA
            [
                'nombre' => 'Dominadas',
                'grupo_muscular' => 'Espalda',
                'dificultad' => 'Avanzado',
                'equipamiento' => 'Barra de Dominadas',
                'descripcion' => 'Ejercicio de tracción vertical fundamental.',
                'video_url' => 'https://www.youtube.com/embed/npyLB-7o19o',
                'series_sugeridas' => 3,
                'reps_sugeridas' => 'Fallo técnico'
            ],
            [
                'nombre' => 'Remo con Barra',
                'grupo_muscular' => 'Espalda',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Barra',
                'descripcion' => 'Ejercicio básico para grosor de espalda.',
                'video_url' => 'https://www.youtube.com/embed/CO5qxkz-KkY',
                'series_sugeridas' => 4,
                'reps_sugeridas' => '8-10'
            ],
            [
                'nombre' => 'Remo con Mancuerna',
                'grupo_muscular' => 'Espalda',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Mancuernas, Banco',
                'descripcion' => 'Ejercicio unilateral para el dorsal ancho.',
                'video_url' => 'https://www.youtube.com/embed/qTOaWaCxB8U',
                'series_sugeridas' => 4,
                'reps_sugeridas' => '10-12'
            ],
            [
                'nombre' => 'Jalón al Pecho',
                'grupo_muscular' => 'Espalda',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Polea Alta',
                'descripcion' => 'Ejercicio para amplitud en polea alta.',
                'video_url' => 'https://www.youtube.com/embed/TcYwpzaRS1I',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12'
            ],
            [
                'nombre' => 'Extensiones Lumbares',
                'grupo_muscular' => 'Espalda',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Banco de Ext.',
                'descripcion' => 'Fortalecimiento de la zona baja de la espalda.',
                'video_url' => 'https://www.youtube.com/embed/O8d8I7-qtGg',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '15'
            ],

            // PIERNAS
            [
                'nombre' => 'Sentadilla con Barra',
                'grupo_muscular' => 'Piernas',
                'dificultad' => 'Avanzado',
                'equipamiento' => 'Barra, Rack',
                'descripcion' => 'Desarrollo global de piernas y core.',
                'video_url' => 'https://www.youtube.com/embed/Ur-zj6AiO44',
                'series_sugeridas' => 4,
                'reps_sugeridas' => '8-10'
            ],
            [
                'nombre' => 'Prensa de Piernas',
                'grupo_muscular' => 'Piernas',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Máquina de Prensa',
                'descripcion' => 'Trabajo pesado de cuádriceps y glúteos.',
                'video_url' => 'https://www.youtube.com/embed/bNsrqXUIJqc',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12-15'
            ],
            [
                'nombre' => 'Peso Muerto Rumano',
                'grupo_muscular' => 'Piernas',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Barra o Mancuernas',
                'descripcion' => 'Enfocado en isquiotibiales y glúteos.',
                'video_url' => 'https://www.youtube.com/embed/JCXUYuzwNrM',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '10-12'
            ],
            [
                'nombre' => 'Zancadas (Lunges)',
                'grupo_muscular' => 'Piernas',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Mancuernas',
                'descripcion' => 'Trabajo unilateral para piernas y glúteos.',
                'video_url' => 'https://www.youtube.com/embed/D7KaRcUTQeE',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12'
            ],
            [
                'nombre' => 'Extensiones Pierna',
                'grupo_muscular' => 'Piernas',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Máquina de Ext.',
                'descripcion' => 'Aislamiento de cuádriceps.',
                'video_url' => 'https://www.youtube.com/embed/YyvSfVjQeL0',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '15'
            ],
            [
                'nombre' => 'Curl Femoral',
                'grupo_muscular' => 'Piernas',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Máquina de Curl',
                'descripcion' => 'Aislamiento de isquiotibiales.',
                'video_url' => 'https://www.youtube.com/embed/1Tq3QdYUuHs',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '15'
            ],

            // BÍCEPS
            [
                'nombre' => 'Curl Bíceps Barra',
                'grupo_muscular' => 'Bíceps',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Barra',
                'descripcion' => 'Desarrollo de masa en el bíceps.',
                'video_url' => 'https://www.youtube.com/embed/-QnKDiHhSro',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '10-12'
            ],
            [
                'nombre' => 'Curl Mancuerna',
                'grupo_muscular' => 'Bíceps',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Mancuernas',
                'descripcion' => 'Trabajo con mayor rango de movimiento.',
                'video_url' => 'https://www.youtube.com/embed/CnKi1AOAE10',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12'
            ],
            [
                'nombre' => 'Curl Martillo',
                'grupo_muscular' => 'Bíceps',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Mancuernas',
                'descripcion' => 'Enfocado en el braquial y antebrazo.',
                'video_url' => 'https://www.youtube.com/embed/PzmSQcFSNPI',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12'
            ],
            [
                'nombre' => 'Concentración',
                'grupo_muscular' => 'Bíceps',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Mancuerna',
                'descripcion' => 'Máxima contracción del bíceps.',
                'video_url' => 'https://www.youtube.com/embed/Jvj2wV0vOYU',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '15'
            ],

            // TRÍCEPS
            [
                'nombre' => 'Extensión Polea',
                'grupo_muscular' => 'Tríceps',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Poleas',
                'descripcion' => 'Aislamiento y definición de tríceps.',
                'video_url' => 'https://www.youtube.com/embed/yZmxX1ypJbE',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12-15'
            ],
            [
                'nombre' => 'Patada de Tríceps',
                'grupo_muscular' => 'Tríceps',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Mancuerna',
                'descripcion' => 'Aislamiento de la cabeza lateral.',
                'video_url' => 'https://www.youtube.com/embed/6SS6K3lAwZ8',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '15'
            ],
            [
                'nombre' => 'Press Francés',
                'grupo_muscular' => 'Tríceps',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Barra Z',
                'descripcion' => 'Uno de los mejores para masa en tríceps.',
                'video_url' => 'https://www.youtube.com/embed/d_KZxkY_0cM',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '10-12'
            ],
            [
                'nombre' => 'Fondos Tríceps',
                'grupo_muscular' => 'Tríceps',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Paralelas',
                'descripcion' => 'Trabajo intenso en paralelas.',
                'video_url' => 'https://www.youtube.com/embed/c3ZGl4pAwZ4',
                'series_sugeridas' => 3,
                'reps_sugeridas' => 'Al fallo'
            ],

            // HOMBROS
            [
                'nombre' => 'Press Militar',
                'grupo_muscular' => 'Hombros',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Barra o Mancuernas',
                'descripcion' => 'Ejercicio básico de fuerza para hombros.',
                'video_url' => 'https://www.youtube.com/embed/4JY1-jVNRqc',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '8-10'
            ],
            [
                'nombre' => 'Elevaciones Lat.',
                'grupo_muscular' => 'Hombros',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Mancuernas',
                'descripcion' => 'Aislamiento del deltoides lateral.',
                'video_url' => 'https://www.youtube.com/embed/t9Cb4hLuGfE',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '15-20'
            ],
            [
                'nombre' => 'Frontales',
                'grupo_muscular' => 'Hombros',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Mancuerna o Disco',
                'descripcion' => 'Aísla el deltoides anterior.',
                'video_url' => 'https://www.youtube.com/embed/-t7fuZ0KhDA',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12-15'
            ],
            [
                'nombre' => 'Pájaros (Rear Delt)',
                'grupo_muscular' => 'Hombros',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Mancuernas',
                'descripcion' => 'Enfocado en el deltoides posterior.',
                'video_url' => 'https://www.youtube.com/embed/4otcO1StZHQ',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '15'
            ],

            // ABDOMEN
            [
                'nombre' => 'Crunch Abdominal',
                'grupo_muscular' => 'Abdomen',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Ninguno',
                'descripcion' => 'Básico para el recto abdominal.',
                'video_url' => 'https://www.youtube.com/embed/irNCQSudRwM',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '15-20'
            ],
            [
                'nombre' => 'Elevación Piernas',
                'grupo_muscular' => 'Abdomen',
                'dificultad' => 'Intermedio',
                'equipamiento' => 'Banco o Suelo',
                'descripcion' => 'Enfocado en la parte inferior del abdomen.',
                'video_url' => 'https://www.youtube.com/embed/X-ACS9vpRyU',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '12-15'
            ],
            [
                'nombre' => 'Plancha (Plank)',
                'grupo_muscular' => 'Abdomen',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Ninguno',
                'descripcion' => 'Ejercicio isométrico para el core.',
                'video_url' => 'https://www.youtube.com/embed/EPbumTj3agk',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '45-60 segundos'
            ],
            [
                'nombre' => 'Toque Puntas',
                'grupo_muscular' => 'Abdomen',
                'dificultad' => 'Principiante',
                'equipamiento' => 'Ninguno',
                'descripcion' => 'Ejercicio para abdomen superior y flexibilidad.',
                'video_url' => 'https://www.youtube.com/embed/QiDNLfNKBYA',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '20'
            ],
            [
                'nombre' => 'Rueda Abdominal',
                'grupo_muscular' => 'Abdomen',
                'dificultad' => 'Avanzado',
                'equipamiento' => 'Rueda Abdom.',
                'descripcion' => 'Ejercicio avanzado para todo el core.',
                'video_url' => 'https://www.youtube.com/embed/mN2gwXOUBlI',
                'series_sugeridas' => 3,
                'reps_sugeridas' => '10-12'
            ],
        ];

        foreach ($ejercicios as $ej) {
            Ejercicio::create($ej);
        }
    }
}
