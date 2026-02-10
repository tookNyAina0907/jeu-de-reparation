<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FirebaseService
{
    protected $projectId;
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->projectId = env('FIREBASE_PROJECT_ID');
        $this->apiKey = env('FIREBASE_API_KEY');
        $this->baseUrl = "https://firestore.googleapis.com/v1/projects/{$this->projectId}/databases/(default)/documents";
    }

    /**
     * Convert PHP array to Firestore JSON format.
     */
    private function formatForFirestore($data)
    {
        $fields = [];
        foreach ($data as $key => $value) {
            $fields[$key] = $this->mapValue($value);
        }
        return ['fields' => (object)$fields];
    }

    private function mapValue($value)
    {
        if (is_null($value)) {
            return ['nullValue' => null];
        }
        if (is_integer($value)) {
            return ['integerValue' => (string)$value];
        }
        if (is_float($value)) {
            return ['doubleValue' => $value];
        }
        if (is_bool($value)) {
            return ['booleanValue' => $value];
        }
        if (is_array($value)) {
            // Simplify: treat associative array as map, indexed as array?
            // For simplicity in this project, we mostly use scalar values or simple maps.
            // If strictly indexed array:
            if (array_is_list($value)) {
                $values = [];
                foreach ($value as $v) {
                    $values[] = $this->mapValue($v);
                }
                return ['arrayValue' => ['values' => $values]];
            } else {
                return ['mapValue' => ['fields' => (object)$this->formatForFirestore($value)['fields']]];
            }
        }
        // Default to string
        return ['stringValue' => (string)$value];
    }

    /**
     * Write document to Firestore.
     */
    public function setDocument($collection, $docId, $data)
    {
        if (!$this->projectId) return;

        $url = "{$this->baseUrl}/{$collection}/{$docId}";
        if ($this->apiKey) {
            $url .= "?key={$this->apiKey}";
        }

        // Use PATCH to update/create
        Http::patch($url, $this->formatForFirestore($data));
    }

    /**
     * Synchronise toutes les données avec Firebase (Firestore).
     *
     * @return void
     */
    public function syncAll()
    {
        if (!$this->projectId) {
            return;
        }

        // 1. Sync Users
        $users = \App\Models\User::all();
        foreach ($users as $user) {
            $this->setDocument('t_users', (string)$user->id, [
                'nom' => $user->nom,
                'email' => $user->email,
                'contact' => $user->contact,
                'role' => $user->role ?? 'client'
            ]);
        }

        // 2. Sync Voitures
        $voitures = \App\Models\Voiture::all();
        foreach ($voitures as $voiture) {
            // Firestore often uses string IDs. We cast existing int IDs to string.
            $this->setDocument('t_voiture', (string)$voiture->id, [
                'matricule' => $voiture->matricule,
                'modele' => $voiture->modele ?? 'Modele Inconnu',
                'users_id' => (string)$voiture->users_id,
            ]);
        }

        // 3. Sync Types Interventions
        $types = \App\Models\TypeIntervention::all();
        foreach ($types as $type) {
            $this->setDocument('t_type_interventions', (string)$type->id, [
                'nom' => $type->nom,
                'description_interventions' => $type->description_interventions,
                'prix' => (int)$type->prix,
                'duree' => $type->duree
            ]);
        }

        // 4. Sync Statuts
        $statuts = \App\Models\Statut::all();
        foreach ($statuts as $statut) {
            $this->setDocument('t_statut', (string)$statut->id, [
                'nom' => $statut->nom
            ]);
        }

        // 5. Sync Reparations
        $reparations = \App\Models\Reparation::with(['reparationStatuts', 'paiements'])->get();
        foreach ($reparations as $reparation) {
            $this->setDocument('t_reparation', (string)$reparation->id, [
                'voiture_id' => (string)$reparation->voiture_id,
                'type_id' => (string)$reparation->type_id,
                'statut_id' => (string)$reparation->statut_id
            ]);

            // Sync History
            foreach ($reparation->reparationStatuts as $statutHistory) {
                $this->setDocument('t_reparation_statut', (string)$statutHistory->id, [
                    'reparation_id' => (string)$statutHistory->reparations_id,
                    'statut_id' => (string)$statutHistory->statut_id,
                    'date_statut' => $statutHistory->date_statut // Might need formatting
                ]);
            }
        }

        // 6. Sync Paiements
        if (class_exists(\App\Models\Paiement::class)) {
            $paiements = \App\Models\Paiement::all();
            foreach ($paiements as $paiement) {
                $this->setDocument('t_paiement', (string)$paiement->id, [
                    'voiture_id' => (string)$paiement->voiture_id,
                    'montant' => (float)$paiement->montant,
                    'date_paiement' => $paiement->date_paiement
                ]);
            }
        }
    }
}
