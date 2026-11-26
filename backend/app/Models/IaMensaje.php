<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IaMensaje extends Model
{
    protected $table = 'ia_mensajes';

    protected $fillable = [
        'user_id',
        'role',
        'content',
    ];
}
