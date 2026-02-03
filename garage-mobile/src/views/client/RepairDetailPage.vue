<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Détails Réparation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" v-if="car">
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{ car.licensePlate }}</ion-card-subtitle>
          <ion-card-title>{{ car.model }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>Status:</strong> {{ formatStatus(car.status) }}</p>
          <p><strong>Description:</strong> {{ car.description }}</p>
          
          <div class="progress-section" v-if="car.status === 'IN_PROGRESS' || car.status === 'DONE'">
            <ion-label>Progression globale</ion-label>
            <ion-progress-bar :value="car.progress / 100" :color="getStatusColor(car.status)"></ion-progress-bar>
            <p class="ion-text-end">{{ car.progress }}%</p>
          </div>

          <ion-list>
            <ion-list-header>Réparations</ion-list-header>
            <ion-item v-for="repair in car.repairs" :key="repair">
              <ion-icon slot="start" :icon="construct" color="medium"></ion-icon>
              <ion-label>{{ repair }}</ion-label>
            </ion-item>
          </ion-list>

          <div v-if="car.status === 'DONE'" class="payment-section">
            <h3 class="ion-text-center">Total: {{ car.totalCost.toLocaleString() }} Ar</h3>
            <ion-button expand="block" color="success" :router-link="'/payment/' + car.id">
              Payer et Récupérer
            </ion-button>
          </div>

          <div v-if="car.status === 'PAID'" class="paid-section">
            <ion-button expand="block" color="medium" disabled>
              Déjà Payé
            </ion-button>
          </div>

        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonProgressBar, IonLabel, IonList, IonListHeader, IonItem, IonIcon, IonButton } from '@ionic/vue';
import { construct } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { GarageService, Car } from '@/services/MockGarageService';

const route = useRoute();
const car = ref<Car | undefined>(undefined);

onMounted(async () => {
  const id = Number(route.params.id);
  car.value = await GarageService.getCarById(id);
});

const getStatusColor = (status: string) => {
  switch(status) {
    case 'DONE': return 'success';
    case 'IN_PROGRESS': return 'warning';
    default: return 'primary';
  }
};

const formatStatus = (status: string) => {
    switch(status) {
        case 'PENDING': return 'En attente';
        case 'IN_PROGRESS': return 'En cours';
        case 'DONE': return 'Terminé';
        case 'PAID': return 'Payé';
        default: return status;
    }
}
</script>

<style scoped>
.progress-section {
  margin-top: 20px;
  margin-bottom: 20px;
}
.payment-section {
  margin-top: 30px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>
