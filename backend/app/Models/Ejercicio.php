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
        'musculos_secundarios',
        'dificultad',
        'equipamiento',
        'descripcion',
        'video_url',
        'series_sugeridas',
        'reps_sugeridas',
        'tiempo_descanso'
    ];

    protected $casts = [
        'id' => 'string'
    ];

    public function usuariosFavoritos()
    {
        return $this->belongsToMany(User::class , 'ejercicio_favoritos', 'ejercicio_id', 'user_id')->withTimestamps();
    }
}
