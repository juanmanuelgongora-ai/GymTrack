<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Hito extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'cliente_id',
        'titulo',
        'descripcion',
        'tipo',
        'meta_valor',
        'valor_actual',
        'unidad',
        'progreso_porcentaje',
        'estado',
        'fecha_limite'
    ];

    protected $casts = [
        'fecha_limite' => 'date',
        'meta_valor' => 'float',
        'valor_actual' => 'float',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
