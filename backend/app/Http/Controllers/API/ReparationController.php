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
<<<<<<< HEAD
        $reparations = Reparation::with(['voiture.user', 'typeIntervention', 'reparationsStatuts.statut'])->get();
=======
        $reparations = Reparation::with(['voiture.user', 'typeIntervention', 'statut'])->get();
>>>>>>> d0fb118 (Update project)
        return response()->json($reparations, 200);
    }

    // Fonction pour créer une réparation
    public function store(Request $request)
    {
        // Valider les données
        $request->validate([
<<<<<<< HEAD
            'voiture_id' => 'required|exists:t_voiture,id',
            'type_id' => 'required|exists:t_type_interventions,id',
            'statut_id' => 'required|exists:t_statut,id',
=======
            'idvoiture' => 'required|exists:voitures,id',
            'idtypeIntervention' => 'required|exists:type_interventions,id',
            'idstatut' => 'required|exists:statuts,id',
>>>>>>> d0fb118 (Update project)
        ]);

        // Créer la réparation
        $reparation = Reparation::create([
<<<<<<< HEAD
            'voiture_id' => $request->voiture_id,
            'type_id' => $request->type_id,
        ]);

        // Créer le statut initial dans l'historique
        $reparation->reparationsStatuts()->create([
            'statut_id' => $request->statut_id,
            'date_statut' => now(),
=======
            'idvoiture' => $request->idvoiture,
            'idtypeIntervention' => $request->idtypeIntervention,
            'idstatut' => $request->idstatut,
>>>>>>> d0fb118 (Update project)
        ]);

        return response()->json([
            'message' => 'Réparation créée avec succès',
<<<<<<< HEAD
            'reparation' => $reparation->load(['voiture.user', 'typeIntervention', 'reparationsStatuts.statut']),
=======
            'reparation' => $reparation->load(['voiture.user', 'typeIntervention', 'statut']),
>>>>>>> d0fb118 (Update project)
        ], 201);
    }

    // Fonction pour modifier une réparation
    public function update(Request $request, $id)
    {
        // Valider les données
        $request->validate([
<<<<<<< HEAD
            'voiture_id' => 'sometimes|required|exists:t_voiture,id',
            'type_id' => 'sometimes|required|exists:t_type_interventions,id',
            'statut_id' => 'sometimes|required|exists:t_statut,id',
=======
            'idvoiture' => 'sometimes|required|exists:voitures,id',
            'idtypeIntervention' => 'sometimes|required|exists:type_interventions,id',
            'idstatut' => 'sometimes|required|exists:statuts,id',
>>>>>>> d0fb118 (Update project)
        ]);

        // Trouver la réparation
        $reparation = Reparation::find($id);
        
        if (!$reparation) {
            return response()->json([
                'message' => 'Réparation non trouvée',
            ], 404);
        }

<<<<<<< HEAD
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
=======
        // Mettre à jour la réparation
        $reparation->update($request->only(['idvoiture', 'idtypeIntervention', 'idstatut']));

        return response()->json([
            'message' => 'Réparation modifiée avec succès',
            'reparation' => $reparation->load(['voiture.user', 'typeIntervention', 'statut']),
>>>>>>> d0fb118 (Update project)
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

<<<<<<< HEAD
        // Supprimer la réparation (la cascade supprimera l'historique dans la DB)
=======
        // Supprimer la réparation
>>>>>>> d0fb118 (Update project)
        $reparation->delete();

        return response()->json([
            'message' => 'Réparation supprimée avec succès',
        ], 200);
    }
}
