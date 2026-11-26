<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RutinaProgreso extends Model
{
    use HasUuids;

    protected $table = 'rutina_progresos';

    protected $fillable = [
        'user_id',
        'rutina_id',
        'progreso_json',
    ];

    protected $casts = [
        'progreso_json' => 'array',
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
