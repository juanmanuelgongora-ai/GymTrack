<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PlanAlimentacion extends Model
{
    use HasUuids;

    protected $table = 'planes_alimentacion';

    protected $fillable = ['user_id', 'plan_json', 'activo'];

    protected $casts = [
        'plan_json' => 'array',
        'activo' => 'boolean',
    ];
}
