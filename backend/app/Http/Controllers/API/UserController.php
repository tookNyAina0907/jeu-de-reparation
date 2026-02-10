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
}
