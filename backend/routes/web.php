<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => '✅ Backend Laravel fonctionne correctement !',
        'version' => 'Laravel ' . app()->version(),
        'php_version' => 'PHP ' . phpversion(),
        'database' => 'PostgreSQL connecté',
        'api_endpoints' => [
            'POST /api/signup' => 'Inscription',
            'POST /api/login' => 'Connexion',
            'GET /api/test' => 'Test sans authentification',
        ],
        'documentation' => 'Consultez README.md pour plus d\'informations'
    ]);
});

// Route de test publique
Route::get('/api/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'L\'API fonctionne correctement !',
        'timestamp' => now()->toDateTimeString(),
    ]);
});
