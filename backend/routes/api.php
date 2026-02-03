<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\ReparationController;
use App\Http\Controllers\API\StatutController;
use App\Http\Controllers\API\TypeInterventionController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\VoitureController;
use Illuminate\Support\Facades\Route;

// Routes d'authentification (publiques)
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Routes d'authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Routes pour les interventions
    Route::apiResource('interventions', TypeInterventionController::class);

    // Routes pour les voitures
    Route::get('/voitures/en-cours', [VoitureController::class, 'enCours']);
    Route::apiResource('voitures', VoitureController::class);

    // Routes pour les réparations
    Route::apiResource('reparations', ReparationController::class);

    // Routes pour les statuts
    Route::get('/statuts', [StatutController::class, 'index']);

    // Routes pour les utilisateurs
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);

    // Routes pour le tableau de bord
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
