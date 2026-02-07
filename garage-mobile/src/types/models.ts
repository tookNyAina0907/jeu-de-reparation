export interface User {
    id?: string; // Firestore ID
    nom: string;
    email: string;
    motdepasse?: string; // Recommended: Use Firebase Auth instead of storing passwords
    contact: string;
    role: string; // e.g., "client", "admin"
}

export interface Voiture {
    id?: string;
    matricule: string;
    modele: string;
    users_id: string; // Reference to User ID
}

export interface TypeIntervention {
    id?: string;
    nom: string;
    description_interventions: string;
    prix: number;
    duree: number; // Duration in minutes
}

export interface Statut {
    id?: string;
    nom: string;
}

export interface Reparation {
    id?: string;
    voiture_id: string; // Reference to Voiture ID
    type_id: string; // Reference to TypeIntervention ID
}

export interface ReparationStatut {
    id?: string;
    reparation_id: string; // Reference to Reparation ID
    statut_id: string; // Reference to Statut ID
    date_statut: Date; // Timestamp
}
