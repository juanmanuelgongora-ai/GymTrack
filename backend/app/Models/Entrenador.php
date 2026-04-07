<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Entrenador extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'entrenadores';
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'user_id',
        'especialidad',
        'experiencia_anios',
        'certificacion',
        'horarios',
        'tipos_entrenamiento',
        'capacidad_maxima',
        'objetivos_profesionales'
    ];

    protected $casts = [
        'horarios' => 'array',
        'tipos_entrenamiento' => 'array'
    ];
}
