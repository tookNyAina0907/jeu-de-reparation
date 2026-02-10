import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where
} from "firebase/firestore";
import {
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { db, auth } from "./config";

// --- SERVICES D'AUTHENTIFICATION ---

export const userService = {
    getAll: () => getAllDocuments("t_users"),
    getById: (id) => getDocumentById("t_users", id),
    getByEmail: async (email) => {
        const q = query(collection(db, "t_users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const resultDoc = querySnapshot.docs[0];
        return { id: resultDoc.id, ...resultDoc.data() };
    },
    create: (data) => addDocument("t_users", data),
    update: (id, data) => updateDocument("t_users", id, data),
    delete: (id) => deleteDocument("t_users", id),
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Firebase Auth réussi pour:", user.email);

        // On essaye de récupérer les données par Email
        let userDoc = await userService.getByEmail(email);

        // Si non trouvé, on essaye par UID (ID du document = UID Firebase Auth)
        if (!userDoc) {
            console.log("Doc non trouvé par email, essai par UID:", user.uid);
            userDoc = await userService.getById(user.uid);
        }

        console.log("Données Firestore récupérées:", userDoc);

        return {
            ok: true,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                ...(userDoc || {}) // On fusionne les données Firestore (nom, role, etc.)
            }
        };
    } catch (error) {
        console.error("Erreur de connexion:", error.message);
        return { ok: false, error: error.message };
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { ok: true };
    } catch (error) {
        console.error("Erreur de déconnexion:", error.message);
        return { ok: false, error: error.message };
    }
};

export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { ok: true, user: userCredential.user };
    } catch (error) {
        console.error("Erreur d'inscription:", error.message);
        return { ok: false, error: error.message };
    }
};

// --- SERVICES SPECIFIQUES (Mappage SQL -> Firestore) ---

/**
 * Gestion des Voitures (t_voiture)
 */
export const voitureService = {
    getAll: () => getAllDocuments("t_voiture"),
    getByUser: async (userId) => {
        const q = query(collection(db, "t_voiture"), where("users_id", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    create: (data) => addDocument("t_voiture", data),
    update: (id, data) => updateDocument("t_voiture", id, data),
    delete: (id) => deleteDocument("t_voiture", id),
};

/**
 * Catalogue des interventions (t_type_interventions)
 */
export const interventionTypeService = {
    getAll: () => getAllDocuments("t_type_interventions"),
    create: (data) => addDocument("t_type_interventions", data),
};

/**
 * Gestion des Statuts (t_statut)
 */
export const statutService = {
    getAll: () => getAllDocuments("t_statut"),
    create: (data) => addDocument("t_statut", data),
};

/**
 * Gestion des Réparations (t_reparation)
 */
export const reparationService = {
    getAll: () => getAllDocuments("t_reparation"),
    create: async (data) => {
        const reparation = await addDocument("t_reparation", data);
        // Initialiser l'historique avec le statut "En attente" par défaut ou celui fourni
        await addDocument("t_reparations_statut", {
            reparations_id: reparation.id,
            statut_id: data.statut_id || "en_attente",
            date_statut: new Date().toISOString()
        });
        return reparation;
    },
    updateStatut: async (reparationId, newStatutId) => {
        // 1. Mettre à jour le statut de la réparation
        await updateDocument("t_reparation", reparationId, { statut_id: newStatutId });
        await addDocument("t_reparations_statut", {
            reparations_id: reparationId,
            statut_id: newStatutId,
            date_statut: new Date().toISOString()
        });

        // 2. Si le statut est "Terminé", on vérifie si toutes les réparations de la voiture sont finies
        if (newStatutId === "Terminé" || newStatutId === "terminé") {
            const currentRep = await getDocumentById("t_reparation", reparationId);
            if (currentRep && currentRep.voiture_id) {
                const voitureId = currentRep.voiture_id;

                // Récupérer toutes les réparations de cette voiture
                const q = query(collection(db, "t_reparation"), where("voiture_id", "==", voitureId));
                const snapshot = await getDocs(q);
                const allReparations = snapshot.docs.map(doc => doc.data());

                // Vérifier si elles sont toutes à "Terminé"
                const allDone = allReparations.every(r => r.statut_id === "Terminé" || r.statut_id === "terminé" || r.statut_id === "Payé" || r.statut_id === "payé");

                if (allDone) {
                    // Mettre à jour la voiture pour la notification mobile
                    await updateDocument("t_voiture", voitureId, { toutFini: true });
                    console.log(`Toutes les réparations pour ${voitureId} sont finies. Flag toutFini activé.`);
                }
            }
        }

        return { ok: true };
    },
    getHistory: async (reparationId) => {
        const q = query(collection(db, "t_reparations_statut"), where("reparations_id", "==", reparationId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};

// --- SERVICES FIRESTORE (Génériques) ---

/**
 * Récupère tous les documents d'une collection
 */
export const getAllDocuments = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Erreur lors de la récupération de ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Ajoute un document à une collection
 */
export const addDocument = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: new Date().toISOString()
        });
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error(`Erreur lors de l'ajout dans ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Met à jour un document par son ID
 */
export const updateDocument = async (collectionName, id, data) => {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
        return { id, ...data };
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de ${id} dans ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Supprime un document par son ID
 */
export const deleteDocument = async (collectionName, id) => {
    try {
        await deleteDoc(doc(db, collectionName, id));
        return { id };
    } catch (error) {
        console.error(`Erreur lors de la suppression de ${id} dans ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Récupère un document par son ID
 */
export const getDocumentById = async (collectionName, id) => {
    try {
        const docSnap = await getDoc(doc(db, collectionName, id));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération du doc ${id}:`, error);
        throw error;
    }
};
