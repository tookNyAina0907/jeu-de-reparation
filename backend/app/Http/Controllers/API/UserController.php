<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Fonction pour obtenir tous les utilisateurs avec leurs voitures et réparations
    public function index()
    {
        $users = User::with(['voitures.reparations.typeIntervention', 'voitures.reparations.reparationsStatuts.statut'])->get();
        return response()->json($users, 200);
    }

    // Fonction pour obtenir un utilisateur spécifique
    public function show($id)
    {
        $user = User::with(['voitures.reparations.typeIntervention', 'voitures.reparations.reparationsStatuts.statut'])->find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json($user, 200);
    }

    // Fonction pour obtenir l'historique des réparations d'un client
    public function getRepairHistory($id)
    {
        $user = User::with(['voitures.reparations.typeIntervention', 'voitures.reparations.reparationsStatuts.statut'])->find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Collecter toutes les réparations de toutes les voitures du client
        $repairs = [];
        foreach ($user->voitures as $voiture) {
            foreach ($voiture->reparations as $reparation) {
                // Récupérer le dernier statut pour obtenir la date
                $latestStatut = $reparation->reparationsStatuts()->orderBy('date_statut', 'desc')->first();

                $repairs[] = [
                    'id' => $reparation->id,
                    'type_intervention' => $reparation->typeIntervention->nom,
                    'description' => $reparation->typeIntervention->description_interventions,
                    'prix' => $reparation->typeIntervention->prix,
                    'date' => $latestStatut ? $latestStatut->date_statut : null,
                    'voiture' => $voiture->matricule,
                    'statut' => $latestStatut ? $latestStatut->statut->nom : 'Inconnu',
                ];
            }
        }

        // Trier par date décroissante
        usort($repairs, function ($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        return response()->json([
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'contact' => $user->contact,
            ],
            'repairs' => $repairs,
        ], 200);
    }
}
