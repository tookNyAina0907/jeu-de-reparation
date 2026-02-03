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
        $reparations = Reparation::with(['voiture.user', 'typeIntervention', 'reparationsStatuts.statut'])->get();
        return response()->json($reparations, 200);
    }

    // Fonction pour créer une réparation
    public function store(Request $request)
    {
        // Valider les données
        $request->validate([
            'voiture_id' => 'required|exists:t_voiture,id',
            'type_id' => 'required|exists:t_type_interventions,id',
            'statut_id' => 'required|exists:t_statut,id',
        ]);

        // Créer la réparation
        $reparation = Reparation::create([
            'voiture_id' => $request->voiture_id,
            'type_id' => $request->type_id,
        ]);

        // Créer le statut initial dans l'historique
        $reparation->reparationsStatuts()->create([
            'statut_id' => $request->statut_id,
            'date_statut' => now(),
        ]);

        return response()->json([
            'message' => 'Réparation créée avec succès',
            'reparation' => $reparation->load(['voiture.user', 'typeIntervention', 'reparationsStatuts.statut']),
        ], 201);
    }

    // Fonction pour modifier une réparation
    public function update(Request $request, $id)
    {
        // Valider les données
        $request->validate([
            'voiture_id' => 'sometimes|required|exists:t_voiture,id',
            'type_id' => 'sometimes|required|exists:t_type_interventions,id',
            'statut_id' => 'sometimes|required|exists:t_statut,id',
        ]);

        // Trouver la réparation
        $reparation = Reparation::find($id);
        
        if (!$reparation) {
            return response()->json([
                'message' => 'Réparation non trouvée',
            ], 404);
        }

        // Mettre à jour la réparation (voiture ou type)
        $reparation->update($request->only(['voiture_id', 'type_id']));

        // Si un nouveau statut est fourni, l'ajouter à l'historique
        if ($request->has('statut_id')) {
            $reparation->reparationsStatuts()->create([
                'statut_id' => $request->statut_id,
                'date_statut' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Réparation modifiée avec succès',
            'reparation' => $reparation->load(['voiture.user', 'typeIntervention', 'reparationsStatuts.statut']),
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

        // Supprimer la réparation (la cascade supprimera l'historique dans la DB)
        $reparation->delete();

        return response()->json([
            'message' => 'Réparation supprimée avec succès',
        ], 200);
    }
}
