<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Voiture;
use Illuminate\Http\Request;

class VoitureController extends Controller
{
    // Fonction pour obtenir toutes les voitures
    public function index()
    {
        $voitures = Voiture::with('user')->get();
        return response()->json($voitures, 200);
    }

    // Fonction pour obtenir les voitures en cours de réparation
    public function enCours()
    {
        $voitures = Voiture::whereHas('reparations', function($query) {
<<<<<<< HEAD
            $query->whereHas('reparationsStatuts', function($q) {
                $q->whereHas('statut', function($sq) {
                    $sq->whereIn('nom', ['En attente', 'En cours']);
                });
            });
        })->with(['user', 'reparations.typeIntervention', 'reparations.reparationsStatuts.statut'])->get();
=======
            $query->whereHas('statut', function($q) {
                $q->whereIn('nom', ['En attente', 'En cours']);
            });
        })->with(['user', 'reparations.typeIntervention', 'reparations.statut'])->get();
>>>>>>> d0fb118 (Update project)

        return response()->json($voitures, 200);
    }

    // Fonction pour créer une voiture
    public function store(Request $request)
    {
        // Valider les données
        $request->validate([
<<<<<<< HEAD
            'matricule' => 'required|string|max:255|unique:t_voiture',
            'users_id' => 'required|exists:t_users,id',
=======
            'matricule' => 'required|string|max:255|unique:voitures',
            'iduser' => 'required|exists:users,id',
>>>>>>> d0fb118 (Update project)
        ]);

        // Créer la voiture
        $voiture = Voiture::create([
            'matricule' => $request->matricule,
<<<<<<< HEAD
            'users_id' => $request->users_id,
=======
            'iduser' => $request->iduser,
>>>>>>> d0fb118 (Update project)
        ]);

        return response()->json([
            'message' => 'Voiture créée avec succès',
            'voiture' => $voiture->load('user'),
        ], 201);
    }

    // Fonction pour obtenir une voiture
    public function show($id)
    {
<<<<<<< HEAD
        $voiture = Voiture::with(['user', 'reparations.typeIntervention', 'reparations.reparationsStatuts.statut'])->find($id);
=======
        $voiture = Voiture::with(['user', 'reparations.typeIntervention', 'reparations.statut'])->find($id);
>>>>>>> d0fb118 (Update project)
        
        if (!$voiture) {
            return response()->json([
                'message' => 'Voiture non trouvée',
            ], 404);
        }

        return response()->json($voiture, 200);
    }
}
