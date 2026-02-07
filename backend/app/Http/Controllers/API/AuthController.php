<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Fonction pour l'inscription
    public function signup(Request $request)
    {
        // Valider les données
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'motDePasse' => 'required|string|min:6',
        ]);

        // Créer l'utilisateur
        $user = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'motDePasse' => Hash::make($request->motDePasse),
        ]);

        // Créer un token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner la réponse
        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // Fonction pour la connexion
    public function login(Request $request)
    {
        // Valider les données
        $request->validate([
            'email' => 'required|email',
            'motDePasse' => 'required',
        ]);

        // Chercher l'utilisateur
        $user = User::where('email', $request->email)->first();

        // Vérifier le mot de passe
        if (!$user || !Hash::check($request->motDePasse, $user->motDePasse)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        // Créer un token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner la réponse
        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    // Fonction pour la déconnexion
    public function logout(Request $request)
    {
        // Supprimer le token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ], 200);
    }

    // Fonction pour obtenir l'utilisateur connecté
    public function me(Request $request)
    {
        return response()->json($request->user(), 200);
    }
}
