<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ejercicio extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ejercicios';

    protected $fillable = [
        'nombre',
        'grupo_muscular',
        'dificultad',
        'equipamiento',
        'descripcion',
        'video_url',
        'series_sugeridas',
        'reps_sugeridas'
    ];

    protected $casts = [
        'series_sugeridas' => 'integer',
    ];
}
