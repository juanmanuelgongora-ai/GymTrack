<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rutina extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rutinas';

    protected $fillable = [
        'user_id',
        'plan_semanal',
        'activa'
    ];

    protected $casts = [
        'plan_semanal' => 'array',
        'activa' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
