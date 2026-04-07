<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class MetricaCorporal extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'metricas_corporales';
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'cliente_id',
        'fecha',
        'peso_kg',
        'altura_cm',
        'imc',
        'grasa_corporal',
        'masa_muscular',
        'pecho_cm',
        'cintura_cm',
        'cadera_cm',
        'brazo_cm',
        'muslo_cm',
        'notas'
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
