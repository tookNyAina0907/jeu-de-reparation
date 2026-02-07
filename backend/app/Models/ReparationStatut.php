<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReparationStatut extends Model
{
    use HasFactory;

    protected $table = 't_reparations_statut';

    protected $fillable = [
        'reparations_id',
        'statut_id',
        'date_statut',
    ];

    public function reparation()
    {
        return $this->belongsTo(Reparation::class, 'reparations_id');
    }

    public function statut()
    {
        return $this->belongsTo(Statut::class, 'statut_id');
    }
}
