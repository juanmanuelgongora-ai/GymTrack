<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Transaccion extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'transacciones';

    protected $fillable = [
        'id',
        'cliente_id',
        'concepto',
        'monto',
        'metodo_pago',
        'estado',
        'created_at'
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
