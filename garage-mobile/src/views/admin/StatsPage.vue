<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="garage-bg">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Statistiques</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding garage-bg">
      <div v-if="loading" class="ion-text-center ion-padding">
        <ion-spinner></ion-spinner>
      </div>

      <div v-else class="stats-container">
        <!-- Card 1: Montant Total -->
        <div class="garage-card stat-card">
          <div class="stat-icon-bg money">
             <ion-icon :icon="cashOutline"></ion-icon>
          </div>
          <div class="stat-content">
            <h3>Montant Total</h3>
            <p class="stat-value">{{ formatMoney(totalAmount) }}</p>
            <span class="stat-sub">Interventions réalisées</span>
          </div>
        </div>

        <!-- Card 2: Nombre de Clients -->
        <div class="garage-card stat-card">
          <div class="stat-icon-bg users">
             <ion-icon :icon="peopleOutline"></ion-icon>
          </div>
          <div class="stat-content">
            <h3>Clients</h3>
            <p class="stat-value">{{ totalClients }}</p>
            <span class="stat-sub">Utilisateurs enregistrés</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonSpinner, IonIcon, onIonViewWillEnter } from '@ionic/vue';
import { cashOutline, peopleOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { DatabaseService } from '@/services/DatabaseService';

const totalAmount = ref(0);
const totalClients = ref(0);
const loading = ref(true);

const loadStats = async () => {
  loading.value = true;
  try {
    // 1. Nombre de clients
    const users = await DatabaseService.getAllUsers();
    totalClients.value = users.length;

    // 2. Montant total des interventions
    // On doit récupérer toutes les réparations, et faire la somme de leurs prix (via le type d'intervention)
    // Note: Dans une application réelle, on optimiserait cela côté backend ou avec des agrégations.
    const repairs = await DatabaseService.getAllReparations();
    const types = await DatabaseService.getAllTypesIntervention();
    
    // Map type details for quick lookup
    const typeMap = new Map(types.map(t => [t.id, t]));

    let total = 0;
    repairs.forEach(repair => {
        const type = typeMap.get(repair.type_id || ''); // Assure type_id correspond au bon champ dans le modèle Ionic
        if (type) {
            total += Number(type.prix);
        }
    });
    totalAmount.value = total;

  } catch (error) {
    console.error('Error loading stats:', error);
  } finally {
    loading.value = false;
  }
};

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(amount);
};

onIonViewWillEnter(() => {
  loadStats();
});
</script>

<style scoped>
.garage-bg {
  --background: #0b0e14;
  --color: #fff;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-card {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon-bg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.stat-icon-bg.money {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
}

.stat-icon-bg.users {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
}

.stat-content h3 {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 5px 0;
  color: #fff;
  font-size: 1.8rem;
  font-weight: bold;
}

.stat-sub {
  color: #64748b;
  font-size: 0.8rem;
}
</style>
