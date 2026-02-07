<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statut extends Model
{
    use HasFactory;

    protected $table = 't_statut';

    protected $fillable = [
        'nom',
    ];

    // Relation avec les suivis de réparations
    public function reparationStatuts()
    {
        return $this->hasMany(ReparationStatut::class, 'statut_id');
    }
}
