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
        'certificado_path',
        'horarios',
        'tipos_entrenamiento',
        'capacidad_maxima',
        'objetivos_profesionales',
        'estado',
        'motivo_rechazo',
        'edad',
        'genero',
        'contacto',
        'direccion',
        'emergencia'
    ];

    protected $casts = [
        'horarios' => 'array',
        'tipos_entrenamiento' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function certificados()
    {
        return $this->hasMany(EntrenadorCertificado::class, 'entrenador_id');
    }
}
