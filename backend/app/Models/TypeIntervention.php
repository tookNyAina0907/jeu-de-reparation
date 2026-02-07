<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeIntervention extends Model
{
    use HasFactory;

    protected $table = 't_type_interventions';

    protected $fillable = [
        'nom',
        'description_interventions',
        'prix',
        'duree',
    ];

    // Relation avec les réparations
    public function reparations()
    {
        return $this->hasMany(Reparation::class, 'type_id');
    }
}
