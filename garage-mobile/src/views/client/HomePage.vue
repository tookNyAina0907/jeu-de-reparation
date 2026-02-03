<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title class="garage-title">MES VÉHICULES</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding garage-bg">
      <h2 class="section-title">RÉPARATIONS EN COURS</h2>
      <div v-if="cars.length > 0" class="cars-list">
        <div v-for="car in cars" :key="car.id" class="car-card-container" @click="router.push('/repair/' + car.id)">
          <div class="garage-card repair-card">
            <div class="card-header">
                <span class="license-plate">{{ car.matricule }}</span>
                <span class="model-name">{{ car.modele }}</span>
            </div>
            <div class="card-body">
                <!-- <p class="owner-name">Martin Dupont</p> -->
                <p class="service-detail">{{ car.serviceDetail }}</p>
                
                <div class="progress-section">
                    <div class="progress-labels">
                        <span>Avancement</span>
                        <span>{{ car.progress }}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" :style="{ width: car.progress + '%' }"></div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>Aucune voiture enregistrée.</p>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="garage-fab" router-link="/add-car">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, onIonViewWillEnter } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { ref } from 'vue';
import { DatabaseService } from '@/services/DatabaseService';
import { AuthService, authState } from '@/services/AuthService';
import { useRouter } from 'vue-router';
import type { Voiture, Reparation } from '@/types/models';

const cars = ref<any[]>([]); // Using any[] to include computed progress/status
const router = useRouter();

const loadCars = async () => {
  if (!authState.user) return;

  try {
     const userCars = await DatabaseService.getVoituresByUser(authState.user.uid);
     
     // Enhance cars with repair details
     const enhancedCars = await Promise.all(userCars.map(async (car) => {
         const repairs = await DatabaseService.getReparationsByVoiture(car.id || '');
         
         // Find active or most recent repair
         // Logic: if there are repairs, pick the last one.
         let currentRepair: any = null;
         let progress = 0;
         let serviceName = "Aucune réparation";
         let status = 'En ordre';

         if (repairs.length > 0) {
             const rep = repairs[repairs.length - 1]; // Get last created
             
             // Get Type info for name and price (assuming we want to show it)
             // Ideally we shouldn't fetch all types every time, but for now:
             const allTypes = await DatabaseService.getAllTypesIntervention();
             const typeDef = allTypes.find(t => t.id === rep.type_id);
             serviceName = typeDef ? `${typeDef.nom} — ${typeDef.prix} Ar` : "Réparation";

             // Check status (history)
             const history = await DatabaseService.getHistoryByReparation(rep.id || '');
             if (history.length > 0) {
                 // Sort by date
                 history.sort((a, b) => new Date(b.date_statut).getTime() - new Date(a.date_statut).getTime());
                 const lastStatus = history[0];
                 
                 // Fetch status name
                 // We could cache stats, but let's fetch for now
                 const allStatuts = await DatabaseService.getAllStatuts();
                 const statusDef = allStatuts.find(s => s.id === lastStatus.statut_id);
                 
                 if (statusDef) {
                     status = statusDef.nom;
                     // Map status to progress (Simplified logic)
                     if (status === 'En attente') progress = 10;
                     else if (status === 'En cours') progress = 50;
                     else if (status === 'Terminé') progress = 100;
                     else if (status === 'Payé') progress = 100;
                 }
             }
         }

         return {
             ...car,
             serviceDetail: serviceName,
             progress: progress,
             statusLabel: status
         };
     }));

     cars.value = enhancedCars;

  } catch (e) {
      console.error("Error loading cars:", e);
  }
};

onIonViewWillEnter(() => {
    loadCars();
});
</script>

<style scoped>
.garage-bg {
  --background: #0b0e14;
}

.section-title {
    color: #fff;
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 20px;
    letter-spacing: 1px;
}

.cars-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.car-card-container {
    cursor: pointer;
}

.repair-card {
    padding: 15px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
    margin-bottom: 15px;
}

.license-plate {
    color: var(--garage-orange);
    font-weight: bold;
    font-size: 1.1rem;
    letter-spacing: 1px;
}

.model-name {
    color: #94a3b8;
    font-size: 0.8rem;
}

.owner-name {
    color: #fff;
    font-size: 0.9rem;
    margin: 0;
    font-weight: 500;
}

.service-detail {
    color: #64748b;
    font-size: 0.8rem;
    margin: 4px 0 15px 0;
}

.progress-section {
    margin-top: 10px;
}

.progress-labels {
    display: flex;
    justify-content: space-between;
    color: var(--garage-orange);
    font-size: 0.75rem;
    font-weight: bold;
    margin-bottom: 8px;
    text-transform: uppercase;
}

.progress-bar-container {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background: var(--garage-orange);
    box-shadow: 0 0 10px var(--garage-orange);
    border-radius: 4px;
}

.garage-fab {
    --background: var(--garage-orange);
    --color: #fff;
    box-shadow: 0 0 15px var(--garage-orange);
}

.empty-state {
    text-align: center;
    margin-top: 50px;
    color: #64748b;
}
</style>
