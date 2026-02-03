<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Statut;
use Illuminate\Http\Request;

class StatutController extends Controller
{
    // Fonction pour obtenir tous les statuts
    public function index()
    {
        $statuts = Statut::all();
        return response()->json($statuts, 200);
    }
}
