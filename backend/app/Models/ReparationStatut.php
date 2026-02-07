<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReparationStatut extends Model
{
    use HasFactory;

    protected $table = 't_reparations_statut';

<<<<<<< HEAD
    public $timestamps = false;

=======
>>>>>>> d0fb118 (Update project)
    protected $fillable = [
        'reparations_id',
        'statut_id',
        'date_statut',
    ];

<<<<<<< HEAD
    // Relation avec la réparation
=======
>>>>>>> d0fb118 (Update project)
    public function reparation()
    {
        return $this->belongsTo(Reparation::class, 'reparations_id');
    }

<<<<<<< HEAD
    // Relation avec le statut
=======
>>>>>>> d0fb118 (Update project)
    public function statut()
    {
        return $this->belongsTo(Statut::class, 'statut_id');
    }
}
