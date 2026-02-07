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

<<<<<<< HEAD
    public $timestamps = false;

=======
>>>>>>> d0fb118 (Update project)
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

<<<<<<< HEAD
    // Méthode pour obtenir le mot de passe pour l'authentification
=======
>>>>>>> d0fb118 (Update project)
    public function getAuthPassword()
    {
        return $this->motdepasse;
    }

<<<<<<< HEAD
    // Relation avec les voitures
=======
>>>>>>> d0fb118 (Update project)
    public function voitures()
    {
        return $this->hasMany(Voiture::class, 'users_id');
    }
}
