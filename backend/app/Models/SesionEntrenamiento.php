<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SesionEntrenamiento extends Model
{
    use HasFactory;

    protected $table = 'sesiones_entrenamiento';

    protected $fillable = [
        'user_id',
        'rutina_id',
        'dia_rutina',
        'detalles_sesion',
        'duracion_minutos'
    ];

    protected $casts = [
        'detalles_sesion' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rutina()
    {
        return $this->belongsTo(Rutina::class);
    }
}
