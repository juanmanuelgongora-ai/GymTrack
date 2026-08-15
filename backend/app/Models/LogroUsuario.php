<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class LogroUsuario extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'logro_usuario';

    protected $fillable = ['id', 'user_id', 'logro_id', 'fecha_obtencion'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logro()
    {
        return $this->belongsTo(Logro::class);
    }
}
