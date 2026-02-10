<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use App\Models\Statut;
use App\Services\FirebaseService;
use Illuminate\Http\Request;

class ReparationController extends Controller
{
    protected $firebaseService;

    public function __construct(FirebaseService $firebaseService)
    {
        $this->firebaseService = $firebaseService;
    }

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

        // Vérifier la capacité du garage (max 3 en cours)
        if (!$this->checkGarageCapacity($request->statut_id)) {
            return response()->json([
                'message' => 'Le garage est plein (maximum 3 voitures en cours de réparation)',
            ], 422);
        }

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

        // Synchroniser avec Firebase
        $this->firebaseService->syncReparation($reparation);

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
            // Vérifier la capacité du garage si on passe en "En cours"
            if (!$this->checkGarageCapacity($request->statut_id, $id)) {
                return response()->json([
                    'message' => 'Le garage est plein (maximum 3 voitures en cours de réparation)',
                ], 422);
            }

            $reparation->reparationsStatuts()->create([
                'statut_id' => $request->statut_id,
                'date_statut' => now(),
            ]);
        }

        // Synchroniser avec Firebase
        $this->firebaseService->syncReparation($reparation);

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

        // Supprimer de Firebase
        $this->firebaseService->deleteReparation($id);

        return response()->json([
            'message' => 'Réparation supprimée avec succès',
        ], 200);
    }

    /**
     * Vérifie si le garage a encore de la place pour une réparation "En cours".
     *
     * @param int $statutId
     * @param int|null $reparationId ID de la réparation actuelle (pour l'update)
     * @return bool
     */
    private function checkGarageCapacity($statutId, $reparationId = null)
    {
        $enCoursStatut = Statut::where('nom', 'En cours')->first();

        // Si le statut n'est pas "En cours", on ne bloque pas
        if (!$enCoursStatut || $statutId != $enCoursStatut->id) {
            return true;
        }

        // Compter les réparations qui sont actuellement "En cours"
        // On exclut la réparation actuelle si c'est un update
        $count = Reparation::whereHas('latestReparationStatut', function ($query) use ($enCoursStatut) {
            $query->where('statut_id', $enCoursStatut->id);
        })
            ->when($reparationId, function ($query) use ($reparationId) {
                $query->where('id', '!=', $reparationId);
            })
            ->count();

        return $count < 3;
    }
}
