<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FirebaseService
{
    protected $databaseUrl;
    protected $secret;

    public function __construct()
    {
        $this->databaseUrl = rtrim(env('FIREBASE_DATABASE_URL'), '/');
        $this->secret = env('FIREBASE_SECRET');
    }

    /**
     * Synchronise une réparation avec Firebase.
     *
     * @param \App\Models\Reparation $reparation
     * @return void
     */
    public function syncReparation($reparation)
    {
        if (!$this->databaseUrl) {
            return;
        }

        $reparation->load(['voiture.user', 'typeIntervention', 'latestReparationStatut.statut']);

        $data = [
            'id' => $reparation->id,
            'voiture' => $reparation->voiture->marque . ' ' . $reparation->voiture->modele,
            'client' => $reparation->voiture->user->name,
            'type' => $reparation->typeIntervention->nom,
            'statut' => $reparation->latestReparationStatut->statut->nom,
            'updated_at' => now()->toDateTimeString(),
        ];

        // Utiliser le secret s'il est configuré pour l'auhentification
        $url = "{$this->databaseUrl}/reparations/{$reparation->id}.json";
        if ($this->secret) {
            $url .= "?auth={$this->secret}";
        }

        Http::put($url, $data);
    }

    /**
     * Supprime une réparation de Firebase.
     *
     * @param int $reparationId
     * @return void
     */
    public function deleteReparation($reparationId)
    {
        if (!$this->databaseUrl) {
            return;
        }

        $url = "{$this->databaseUrl}/reparations/{$reparationId}.json";
        if ($this->secret) {
            $url .= "?auth={$this->secret}";
        }

        Http::delete($url);
    }
}
