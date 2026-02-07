<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statut extends Model
{
    use HasFactory;

    protected $table = 't_statut';

<<<<<<< HEAD
    public $timestamps = false;

=======
>>>>>>> d0fb118 (Update project)
    protected $fillable = [
        'nom',
    ];

<<<<<<< HEAD
    // Relation avec le suivi des réparations
    public function reparationsStatuts()
=======
    // Relation avec les suivis de réparations
    public function reparationStatuts()
>>>>>>> d0fb118 (Update project)
    {
        return $this->hasMany(ReparationStatut::class, 'statut_id');
    }
}
