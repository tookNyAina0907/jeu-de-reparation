<?php

namespace Database\Seeders;

use App\Models\TypeIntervention;
use Illuminate\Database\Seeder;

class TypeInterventionSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
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
        ];

        foreach ($types as $type) {
            TypeIntervention::create($type);
        }
    }
}
