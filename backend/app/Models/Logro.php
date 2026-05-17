<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Logro extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['id', 'nombre', 'descripcion', 'icono', 'categoria', 'meta_valor', 'puntos'];

    public function usuarios()
    {
        return $this->belongsToMany(User::class, 'logro_usuario')
                    ->withPivot('fecha_obtencion')
                    ->withTimestamps();
    }
}
