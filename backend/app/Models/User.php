<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 't_users';

    public $timestamps = false;

    protected $fillable = [
        'nom',
        'email',
        'motdepasse',
        'contact',
    ];

    protected $hidden = [
        'motdepasse',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Méthode pour obtenir le mot de passe pour l'authentification
    public function getAuthPassword()
    {
        return $this->motdepasse;
    }

    // Relation avec les voitures
    public function voitures()
    {
        return $this->hasMany(Voiture::class, 'users_id');
    }
}
