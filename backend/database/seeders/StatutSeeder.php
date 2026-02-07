<?php

namespace Database\Seeders;

use App\Models\Statut;
use Illuminate\Database\Seeder;

class StatutSeeder extends Seeder
{
    public function run(): void
    {
        $statuts = [
            ['nom' => 'En attente'],
            ['nom' => 'En cours'],
<<<<<<< HEAD
            ['nom' => 'Terminé'],
            ['nom' => 'Payé'],
=======
            ['nom' => 'Terminée'],
            ['nom' => 'Annulée'],
>>>>>>> d0fb118 (Update project)
        ];

        foreach ($statuts as $statut) {
            Statut::create($statut);
        }
    }
}
