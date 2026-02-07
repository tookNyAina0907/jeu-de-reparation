<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use Illuminate\Http\Request;

class ReparationController extends Controller
{
    // Fonction pour obtenir toutes les réparations
    public function index()
    {
        $reparations = Reparation::with(['voiture.user', 'typeIntervention', 'statut'])->get();
        return response()->json($reparations, 200);
    }

    // Fonction pour créer une réparation
    public function store(Request $request)
    {
        // Valider les données
        $request->validate([
            'idvoiture' => 'required|exists:voitures,id',
            'idtypeIntervention' => 'required|exists:type_interventions,id',
            'idstatut' => 'required|exists:statuts,id',
        ]);

        // Créer la réparation
        $reparation = Reparation::create([
            'idvoiture' => $request->idvoiture,
            'idtypeIntervention' => $request->idtypeIntervention,
            'idstatut' => $request->idstatut,
        ]);

        return response()->json([
            'message' => 'Réparation créée avec succès',
            'reparation' => $reparation->load(['voiture.user', 'typeIntervention', 'statut']),
        ], 201);
    }

    // Fonction pour modifier une réparation
    public function update(Request $request, $id)
    {
        // Valider les données
        $request->validate([
            'idvoiture' => 'sometimes|required|exists:voitures,id',
            'idtypeIntervention' => 'sometimes|required|exists:type_interventions,id',
            'idstatut' => 'sometimes|required|exists:statuts,id',
        ]);

        // Trouver la réparation
        $reparation = Reparation::find($id);
        
        if (!$reparation) {
            return response()->json([
                'message' => 'Réparation non trouvée',
            ], 404);
        }

        // Mettre à jour la réparation
        $reparation->update($request->only(['idvoiture', 'idtypeIntervention', 'idstatut']));

        return response()->json([
            'message' => 'Réparation modifiée avec succès',
            'reparation' => $reparation->load(['voiture.user', 'typeIntervention', 'statut']),
        ], 200);
    }

    // Fonction pour supprimer une réparation
    public function destroy($id)
    {
        // Trouver la réparation
        $reparation = Reparation::find($id);
        
        if (!$reparation) {
            return response()->json([
                'message' => 'Réparation non trouvée',
            ], 404);
        }

        // Supprimer la réparation
        $reparation->delete();

        return response()->json([
            'message' => 'Réparation supprimée avec succès',
        ], 200);
    }
}
