import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Votre configuration Firebase (récupérée depuis la console Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCORIdlsvp3cKupQcb8ZxdJb-NF12cWSVc",
  authDomain: "jeu-de-reparation.firebaseapp.com",
  projectId: "jeu-de-reparation",
  storageBucket: "jeu-de-reparation.firebasestorage.app",
  messagingSenderId: "143600421982",
  appId: "1:143600421982:web:ba47ce53a9e5d01ccb78cf",
  measurementId: "G-5T5EY2DRP0"
};
// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services dont vous avez besoin
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
