import { statutService, interventionTypeService } from './services';

/**
 * Script pour initialiser les données de base dans Firestore.
 * Utile pour la première configuration du projet.
 */
export const seedDatabase = async () => {
    console.log("Début du seeding...");

    try {
        // 1. Seed des statuts
        const statuts = ['En attente', 'En cours', 'Terminé', 'Payé'];
        for (const nom of statuts) {
            await statutService.create({ nom });
            console.log(`Statut ajouté: ${nom}`);
        }

        // 2. Seed des types d'interventions
        const interventions = [
            { nom: 'Freinage', description_interventions: 'Changement des plaquettes de frein', prix: 30000, duree: '02:00:00' },
            { nom: 'Moteur', description_interventions: 'Diagnostic et réparation moteur', prix: 100000, duree: '04:00:00' }
        ];

        for (const item of interventions) {
            await interventionTypeService.create(item);
            console.log(`Intervention ajoutée: ${item.nom}`);
        }

        console.log("Seeding terminé avec succès !");
        return { ok: true };
    } catch (error) {
        console.error("Erreur durant le seeding:", error);
        return { ok: false, error };
    }
};
