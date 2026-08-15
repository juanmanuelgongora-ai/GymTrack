<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EntrenadorCertificado extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'entrenador_certificados';
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'entrenador_id',
        'titulo',
        'path',
        'emisor',
        'fecha_obtencion',
        'fecha_expiracion'
    ];

    public function entrenador()
    {
        return $this->belongsTo(Entrenador::class, 'entrenador_id');
    }
}
