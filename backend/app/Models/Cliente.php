<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Cliente extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'user_id',
        'gimnasio_id',
        'ubicacion',
        'fecha_nacimiento',
        'genero',
        'peso_kg',
        'altura_cm',
        'imc',
        'nivel_actividad',
        'objetivo_principal',
        'condicion_medica',
        'vencimiento_membresia',
        'activo'
    ];

    protected $appends = ['edad'];

    protected $casts = [
        'vencimiento_membresia' => 'datetime',
        'activo' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function metricas()
    {
        return $this->hasMany(MetricaCorporal::class);
    }

    public function hitos()
    {
        return $this->hasMany(Hito::class);
    }

    public function getEdadAttribute()
    {
        if (!$this->fecha_nacimiento)
            return null;
        return \Carbon\Carbon::parse($this->fecha_nacimiento)->age;
    }
}
