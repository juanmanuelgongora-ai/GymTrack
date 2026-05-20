<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Clase extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'instructor_id',
        'sala',
        'horario_inicio',
        'horario_fin',
        'capacidad_max',
        'color',
        'estado',
    ];

    /**
     * Get the instructor that owns the class.
     */
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Scope to get classes for a specific day/time if needed.
     */
    public function scopeHoy($query)
    {
        return $query->whereDate('created_at', now()->toDateString());
    }
}
