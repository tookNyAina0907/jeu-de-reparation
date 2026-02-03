<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparation extends Model
{
    use HasFactory;

    protected $table = 't_reparations';

    public $timestamps = false;

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

    // Relation avec le suivi des statuts
    public function reparationsStatuts()
    {
        return $this->hasMany(ReparationStatut::class, 'reparations_id');
    }
}
