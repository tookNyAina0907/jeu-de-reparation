<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparation extends Model
{
    use HasFactory;

    protected $table = 't_reparations';

<<<<<<< HEAD
    public $timestamps = false;

=======
>>>>>>> d0fb118 (Update project)
    protected $fillable = [
        'voiture_id',
        'type_id',
    ];

    // Relation avec la voiture
    public function voiture()
    {
        return $this->belongsTo(Voiture::class, 'voiture_id');
    }

    // Relation avec le type d'intervention
    public function typeIntervention()
    {
        return $this->belongsTo(TypeIntervention::class, 'type_id');
    }

<<<<<<< HEAD
    // Relation avec le suivi des statuts
    public function reparationsStatuts()
=======
    // Relation avec les statuts (historique)
    public function statuts()
>>>>>>> d0fb118 (Update project)
    {
        return $this->hasMany(ReparationStatut::class, 'reparations_id');
    }
}
