<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Fonction pour obtenir tous les utilisateurs
    public function index()
    {
        $users = User::select('id', 'nom', 'email')->get();
        return response()->json($users, 200);
    }
}
