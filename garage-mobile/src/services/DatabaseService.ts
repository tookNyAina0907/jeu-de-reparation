import { db } from '@/firebaseConfig';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp
} from 'firebase/firestore';
import type {
    User,
    Voiture,
    TypeIntervention,
    Statut,
    Reparation,
    ReparationStatut
} from '@/types/models';

// Collection refs
const usersCol = collection(db, 't_users');
const voituresCol = collection(db, 't_voiture');
const typesCol = collection(db, 't_type_interventions');
const statutsCol = collection(db, 't_statut');
const reparationsCol = collection(db, 't_reparation');
const reparationsStatutCol = collection(db, 't_reparation_statut');

export const DatabaseService = {
    // --- Users ---
    async createUser(user: User): Promise<string> {
        // Enforce Unique Email
        const existing = await this.getUserByEmail(user.email);
        if (existing) {
            throw new Error(`User with email ${user.email} already exists`);
        }
        const docRef = await addDoc(usersCol, user);
        return docRef.id;
    },

    async getUserByEmail(email: string): Promise<User | null> {
        const q = query(usersCol, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as User;
        }
        return null;
    },

    async getAllUsers(): Promise<User[]> {
        const snapshot = await getDocs(usersCol);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    },

    // --- Voitures ---
    async createVoiture(voiture: Voiture): Promise<string> {
        // Enforce Unique Matricule
        const q = query(voituresCol, where("matricule", "==", voiture.matricule));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            throw new Error(`Voiture with matricule ${voiture.matricule} already exists`);
        }

        const docRef = await addDoc(voituresCol, voiture);
        return docRef.id;
    },

    async getVoituresByUser(userId: string): Promise<Voiture[]> {
        const q = query(voituresCol, where("users_id", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Voiture));
    },

    // --- Types Interventions ---
    async createTypeIntervention(type: TypeIntervention): Promise<string> {
        const docRef = await addDoc(typesCol, type);
        return docRef.id;
    },

    async getAllTypesIntervention(): Promise<TypeIntervention[]> {
        const snapshot = await getDocs(typesCol);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TypeIntervention));
    },

    // --- Statuts ---
    async createStatut(statut: Statut): Promise<string> {
        const docRef = await addDoc(statutsCol, statut);
        return docRef.id;
    },

    async getAllStatuts(): Promise<Statut[]> {
        const snapshot = await getDocs(statutsCol);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Statut));
    },

    async getStatutByName(name: string): Promise<Statut | null> {
        const q = query(statutsCol, where("nom", "==", name));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Statut;
        }
        return null;
    },

    // --- Reparations ---
    async createReparation(reparation: Reparation): Promise<string> {
        const docRef = await addDoc(reparationsCol, reparation);
        return docRef.id;
    },

    async getReparationsByVoiture(voitureId: string): Promise<Reparation[]> {
        const q = query(reparationsCol, where("voiture_id", "==", voitureId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reparation));
    },

    async getAllReparations(): Promise<Reparation[]> {
        const snapshot = await getDocs(reparationsCol);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reparation));
    },

    // --- Reparations Statut (Suivi) ---
    async addReparationStatut(repStatut: ReparationStatut): Promise<string> {
        // Ensure date is stored correctly (Firestore Timestamp or Date)
        const data = {
            ...repStatut,
            date_statut: repStatut.date_statut || new Date()
        };
        const docRef = await addDoc(reparationsStatutCol, data);
        return docRef.id;
    },

    async getHistoryByReparation(reparationId: string): Promise<ReparationStatut[]> {
        const q = query(reparationsStatutCol, where("reparations_id", "==", reparationId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date_statut: (data.date_statut as Timestamp).toDate()
            } as ReparationStatut;
        });
    },

    // --- Seeding ---
    async seedInitialData() {
        // Seed Statuts
        const statuts = ['En attente', 'En cours', 'Terminé', 'Payé'];
        for (const nom of statuts) {
            const exists = await this.getStatutByName(nom);
            if (!exists) {
                await this.createStatut({ nom });
                console.log(`Statut seeded: ${nom}`);
            }
        }

        // Seed Types Interventions
        const types = [
            { nom: 'Vidange', description_interventions: 'Vidange complète avec changement de filtre', prix: 50000, duree: 60 },
            { nom: 'Freinage', description_interventions: 'Changement des plaquettes de frein', prix: 30000, duree: 120 },
            { nom: 'Moteur', description_interventions: 'Diagnostic et réparation moteur', prix: 100000, duree: 240 }
        ];

        const existingTypes = await this.getAllTypesIntervention();
        if (existingTypes.length === 0) {
            for (const t of types) {
                await this.createTypeIntervention(t);
                console.log(`Type seeded: ${t.nom}`);
            }
        }
    }
};
