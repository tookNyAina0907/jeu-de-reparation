<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Données initiales pour les statuts
        \App\Models\Statut::insert([
            ['nom' => 'En attente'],
            ['nom' => 'En cours'],
            ['nom' => 'Terminé'],
            ['nom' => 'Payé'],
        ]);

        // Données initiales pour les types d'interventions
        \App\Models\TypeIntervention::insert([
            [
                'nom' => 'Vidange',
                'description_interventions' => 'Vidange complète avec changement de filtre',
                'prix' => 50000,
                'duree' => '01:00:00'
            ],
            [
                'nom' => 'Freinage',
                'description_interventions' => 'Changement des plaquettes de frein',
                'prix' => 30000,
                'duree' => '02:00:00'
            ],
            [
                'nom' => 'Moteur',
                'description_interventions' => 'Diagnostic et réparation moteur',
                'prix' => 100000,
                'duree' => '04:00:00'
            ],
        ]);
    }
}
