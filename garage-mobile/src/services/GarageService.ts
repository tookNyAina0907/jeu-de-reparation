import { db } from '@/firebaseConfig';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';

export interface Car {
    id: string; // Changed from number to string for Firestore IDs
    model: string;
    licensePlate: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'PAID';
    repairs: string[];
    progress: number;
    totalCost: number;
    entryDate: Date; // Careful with Firestore Timestamps
}

const carsCollection = collection(db, 'cars');

export const GarageService = {
    async getCars(): Promise<Car[]> {
        const snapshot = await getDocs(carsCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
    },

    // Real-time listener (Optional usage)
    subscribeToCars(callback: (cars: Car[]) => void) {
        return onSnapshot(carsCollection, (snapshot) => {
            const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
            callback(cars);
        });
    },

    async addCar(data: { model: string; licensePlate: string; description: string; repairs: string[] }) {
        const newCarData = {
            model: data.model,
            licensePlate: data.licensePlate,
            description: data.description,
            status: 'PENDING',
            repairs: data.repairs,
            progress: 0,
            totalCost: 0,
            entryDate: new Date().toISOString() // Store as string or Timestamp
        };
        const docRef = await addDoc(carsCollection, newCarData);
        return { id: docRef.id, ...newCarData };
    },

    async getCarById(id: string): Promise<Car | undefined> {
        const docRef = doc(db, 'cars', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Car;
        }
        return undefined;
    },

    async updateStatus(id: string, status: 'PENDING' | 'IN_PROGRESS' | 'DONE', progress: number) {
        const docRef = doc(db, 'cars', id);
        const data: any = { status, progress };

        if (status === 'DONE') {
            // We can fetch the car to calculate cost if needed, but for now just simple update
            data.progress = 100;
        }

        await updateDoc(docRef, data);
        return true;
    },

    async pay(id: string) {
        const docRef = doc(db, 'cars', id);
        await updateDoc(docRef, { status: 'PAID' });
        return true;
    }
};
