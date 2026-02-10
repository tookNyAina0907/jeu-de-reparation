<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TypeIntervention;
use Illuminate\Http\Request;

class TypeInterventionController extends Controller
{
    // Fonction pour obtenir toutes les interventions
    public function index()
    {
        $interventions = TypeIntervention::all();
        return response()->json($interventions, 200);
    }

    // Fonction pour créer une intervention
    public function store(Request $request)
    {
        // Valider les données
        $request->validate([
            'nom' => 'required|string|max:255',
            'description_interventions' => 'nullable|string|max:500',
            'prix' => 'required|numeric|min:0',
            'duree' => 'nullable|string', // Format HH:MM:SS
        ]);

        // Créer l'intervention
        $intervention = TypeIntervention::create([
            'nom' => $request->nom,
            'description_interventions' => $request->description_interventions,
            'prix' => $request->prix,
            'duree' => $request->duree,
        ]);

        return response()->json([
            'message' => 'Intervention créée avec succès',
            'intervention' => $intervention,
        ], 201);
    }

    // Fonction pour obtenir une intervention
    public function show($id)
    {
        $intervention = TypeIntervention::find($id);

        if (!$intervention) {
            return response()->json([
                'message' => 'Intervention non trouvée',
            ], 404);
        }

        return response()->json($intervention, 200);
    }

    // Fonction pour modifier une intervention
    public function update(Request $request, $id)
    {
        // Valider les données
        $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description_interventions' => 'nullable|string|max:500',
            'prix' => 'sometimes|required|numeric|min:0',
            'duree' => 'nullable|string',
        ]);

        // Trouver l'intervention
        $intervention = TypeIntervention::find($id);

        if (!$intervention) {
            return response()->json([
                'message' => 'Intervention non trouvée',
            ], 404);
        }

        // Mettre à jour l'intervention
        $intervention->update($request->only(['nom', 'description_interventions', 'prix', 'duree']));

        return response()->json([
            'message' => 'Intervention modifiée avec succès',
            'intervention' => $intervention,
        ], 200);
    }

    // Fonction pour supprimer une intervention
    public function destroy($id)
    {
        // Trouver l'intervention
        $intervention = TypeIntervention::find($id);

        if (!$intervention) {
            return response()->json([
                'message' => 'Intervention non trouvée',
            ], 404);
        }

        // Supprimer l'intervention
        $intervention->delete();

        return response()->json([
            'message' => 'Intervention supprimée avec succès',
        ], 200);
    }
}
