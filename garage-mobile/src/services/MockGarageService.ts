import { reactive } from 'vue';

export interface Car {
    id: number;
    model: string;
    licensePlate: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'PAID';
    repairs: string[]; // Liste des types de réparation
    progress: number; // 0-100
    totalCost: number;
    entryDate: Date;
}

// Données mockées
const cars = reactive<Car[]>([
    {
        id: 1,
        model: 'Peugeot 208',
        licensePlate: '1234 TAB',
        description: 'Problème de freinage',
        status: 'IN_PROGRESS',
        repairs: ['Frein', 'Vidange'],
        progress: 45,
        totalCost: 150000,
        entryDate: new Date()
    },
    {
        id: 2,
        model: 'Toyota Yaris',
        licensePlate: '5678 TBC',
        description: 'Bruit moteur',
        status: 'DONE',
        repairs: ['Moteur'],
        progress: 100,
        totalCost: 800000,
        entryDate: new Date(Date.now() - 86400000) // Hier
    }
]);

export const GarageService = {
    getCars() {
        return Promise.resolve(cars);
    },

    addCar(data: { model: string; licensePlate: string; description: string; repairs: string[] }) {
        const newCar: Car = {
            id: Date.now(),
            model: data.model,
            licensePlate: data.licensePlate,
            description: data.description,
            status: 'PENDING',
            repairs: data.repairs,
            progress: 0,
            totalCost: 0, // Sera calculé par le backend normalement
            entryDate: new Date()
        };
        cars.push(newCar);
        return Promise.resolve(newCar);
    },

    getCarById(id: number) {
        return Promise.resolve(cars.find(c => c.id === id));
    },

    pay(id: number) {
        const car = cars.find(c => c.id === id);
        if (car) {
            car.status = 'PAID';
        }
        return Promise.resolve(true);
    },

    updateStatus(id: number, status: 'PENDING' | 'IN_PROGRESS' | 'DONE', progress: number) {
        const car = cars.find(c => c.id === id);
        if (car) {
            car.status = status;
            car.progress = progress;
            // Si terminé, on peut mettre 100% automatiquement ou laisser le mécano décider
            if (status === 'DONE') {
                car.progress = 100;
                // Calcul du coût final (mock)
                if (car.totalCost === 0) car.totalCost = 50000 * car.repairs.length;
            }
        }
        return Promise.resolve(true);
    }
};
