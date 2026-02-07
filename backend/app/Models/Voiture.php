<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voiture extends Model
{
    use HasFactory;

    protected $table = 't_voiture';

<<<<<<< HEAD
    public $timestamps = false;

=======
>>>>>>> d0fb118 (Update project)
    protected $fillable = [
        'matricule',
        'users_id',
    ];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    // Relation avec les réparations
    public function reparations()
    {
        return $this->hasMany(Reparation::class, 'voiture_id');
    }
}
