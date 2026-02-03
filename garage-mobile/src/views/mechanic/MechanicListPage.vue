<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/profile"></ion-back-button>
        </ion-buttons>
        <ion-title>Atelier Mécanique</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-list-header>
          <ion-label>Véhicules à traiter</ion-label>
        </ion-list-header>
        
        <ion-item v-for="car in cars" :key="car.id" :router-link="'/mechanic/edit/' + car.id" button detail>
          <ion-label>
            <h2>{{ car.model }}</h2>
            <p>{{ car.licensePlate }}</p>
            <ion-badge :color="getStatusColor(car.status)">{{ car.status }}</ion-badge>
          </ion-label>
        </ion-item>

        <div v-if="cars.length === 0" class="ion-padding ion-text-center">
            <p>Aucun véhicule en atelier.</p>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonButtons, IonBackButton, IonListHeader } from '@ionic/vue';
import { ref, onMounted } from 'vue'; // Fixed import
import { GarageService, Car } from '@/services/MockGarageService';

const cars = ref<Car[]>([]);

const loadCars = async () => {
  const allCars = await GarageService.getCars();
  // On ne montre que les voitures qui ne sont pas encore payées/sorties
  cars.value = allCars.filter(c => c.status !== 'PAID'); 
};

onMounted(() => {
    loadCars();
});

const getStatusColor = (status: string) => {
  switch(status) {
    case 'DONE': return 'success';
    case 'IN_PROGRESS': return 'warning';
    case 'PENDING': return 'danger';
    default: return 'medium';
  }
};
</script>
