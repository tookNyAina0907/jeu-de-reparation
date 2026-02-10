<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use App\Models\TypeIntervention;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // Fonction pour obtenir les statistiques du tableau de bord
    public function index()
    {
        // Calculer le montant total des interventions
        $montantTotal = Reparation::with('typeIntervention')
            ->get()
            ->sum(function ($reparation) {
                return $reparation->typeIntervention->prix ?? 0;
            });

        // Compter le nombre de clients
        $nombreClients = User::count();

        // Compter le nombre de réparations en cours
        $reparationsEnCours = Reparation::whereHas('reparationsStatuts', function ($query) {
            $query->whereHas('statut', function ($q) {
                $q->whereIn('nom', ['En attente', 'En cours']);
            });
        })->count();

        return response()->json([
            'montantTotal' => $montantTotal,
            'nombreClients' => $nombreClients,
            'reparationsEnCours' => $reparationsEnCours,
        ], 200);
    }
}
