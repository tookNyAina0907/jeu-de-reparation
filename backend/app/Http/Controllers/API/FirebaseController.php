<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\FirebaseService;
use Illuminate\Http\JsonResponse;

class FirebaseController extends Controller
{
    protected $firebaseService;

    public function __construct(FirebaseService $firebaseService)
    {
        $this->firebaseService = $firebaseService;
    }

    /**
     * Trigger synchronization with Firebase.
     *
     * @return JsonResponse
     */
    public function sync(): JsonResponse
    {
        try {
            $this->firebaseService->syncAll();
            return response()->json([
                'success' => true,
                'message' => 'Base de données synchronisée avec succès vers Firebase.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la synchronisation : ' . $e->getMessage()
            ], 500);
        }
    }
}
