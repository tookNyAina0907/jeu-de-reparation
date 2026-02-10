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
            ['nom' => 'Terminé'],
            ['nom' => 'Payé'],
        ];

        foreach ($statuts as $statut) {
            Statut::create($statut);
        }
    }
}
