import { db, auth } from '@/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { reactive } from 'vue';
import { DatabaseService } from './DatabaseService';
import type { User } from '@/types/models';

export const authState = reactive({
    isAuthenticated: false,
    user: null as FirebaseUser | null,
});

// Sync Auth State
onAuthStateChanged(auth, (user) => {
    authState.user = user;
    authState.isAuthenticated = !!user;
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
});

export const AuthService = {
    async login(email: string, password: string) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    },

    async register(data: any) {
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            // 2. Create Firestore User Document
            // We use the Auth UID as the document ID for easier retrieval
            await DatabaseService.createUser({
                id: user.uid,
                nom: data.fullName,
                email: data.email,
                contact: data.contact,
                motdepasse: data.password
            } as User);

            return true;
        } catch (error) {
            console.error("Registration error:", error);
            return false;
        }
    },

    async logout() {
        try {
            await signOut(auth);
            // Local state update handled by onAuthStateChanged
        } catch (error) {
            console.error("Logout error:", error);
        }
    },

    isAuthenticated() {
        return authState.isAuthenticated;
    }
};
