<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="garage-bg">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Types d'Interventions</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding garage-bg">
      <div v-if="loading" class="ion-text-center ion-padding">
        <ion-spinner></ion-spinner>
      </div>

      <div v-else class="services-list">
        <div v-for="type in interventions" :key="type.id" class="garage-card intervention-card">
          <div class="card-header">
            <h2 class="intervention-name">{{ type.nom }}</h2>
            <ion-badge color="warning">{{ type.prix }} Ar</ion-badge>
          </div>
          <p class="intervention-desc">{{ type.description_interventions }}</p>
          <div class="intervention-meta">
            <ion-icon :icon="timeOutline"></ion-icon>
            <span>Durée: {{ formatDuration(type.duree) }}</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonSpinner, IonBadge, IonIcon, onIonViewWillEnter } from '@ionic/vue';
import { timeOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { DatabaseService } from '@/services/DatabaseService';
import type { TypeIntervention } from '@/types/models';

const interventions = ref<TypeIntervention[]>([]);
const loading = ref(true);

const loadInterventions = async () => {
  loading.value = true;
  try {
    interventions.value = await DatabaseService.getAllTypesIntervention();
  } catch (error) {
    console.error('Error loading interventions:', error);
  } finally {
    loading.value = false;
  }
};

const formatDuration = (seconds: number | string) => {
    // Supposons que c'est en secondes si c'est un nombre, ou format HH:MM:SS
    if (typeof seconds === 'number') {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    }
    return seconds;
};

onIonViewWillEnter(() => {
  loadInterventions();
});
</script>

<style scoped>
.garage-bg {
  --background: #0b0e14;
  --color: #fff;
}

.intervention-card {
  padding: 15px;
  margin-bottom: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.intervention-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
}

.intervention-desc {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
}

.intervention-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--garage-orange);
  font-size: 0.85rem;
}
</style>
