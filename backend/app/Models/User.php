<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    // Desactivamos los timestamps si solo usamos created_at
    // Laravel por defecto buscará created_at y updated_at
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'nombre',
        'apellido',
        'email',
        'password_hash',
        'rol',
        'foto_url'
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password_hash' => 'hashed',
        ];
    }

    // Le decimos a Laravel que use password_hash en vez de password
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function cliente()
    {
        return $this->hasOne(Cliente::class , 'user_id');
    }

    public function favoritos()
    {
        return $this->belongsToMany(Ejercicio::class , 'ejercicio_favoritos', 'user_id', 'ejercicio_id')->withTimestamps();
    }
}
