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
          <ion-card-subtitle>{{ car.matricule }}</ion-card-subtitle>
          <ion-card-title>{{ car.modele }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          
          <div class="progress-section">
            <ion-label>Progression globale</ion-label>
            <ion-progress-bar :value="overallProgress / 100" color="primary"></ion-progress-bar>
            <p class="ion-text-end">{{ overallProgress }}%</p>
          </div>

          <ion-list>
            <ion-list-header>Interventions Prévues</ion-list-header>
            <ion-item v-for="item in interventions" :key="item.id">
              <ion-icon slot="start" :icon="getStatusIcon(item.status)" :color="getStatusColor(item.status)"></ion-icon>
              <ion-label>
                <h2>{{ item.name }}</h2>
                <p>{{ item.price.toLocaleString() }} Ar</p>
              </ion-label>
              <ion-badge slot="end" :color="getStatusColor(item.status)">{{ item.status }}</ion-badge>
            </ion-item>
          </ion-list>

          <div v-if="overallProgress === 100" class="payment-section">
            <h3 class="ion-text-center">Total à payer: {{ totalCost.toLocaleString() }} Ar</h3>
            <ion-button expand="block" color="success" :router-link="'/payment/' + car.id">
              Continuer vers le paiement
            </ion-button>
          </div>

          <div v-if="interventions.some(i => i.status.toLowerCase() === 'payé')" class="paid-section">
            <p class="ion-text-center ion-padding-top" style="color: var(--ion-color-success)">
              <ion-icon :icon="checkmarkCircle"></ion-icon> Facture réglée
            </p>
          </div>

        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonProgressBar, IonLabel, IonList, IonListHeader, IonItem, IonIcon, IonButton, IonBadge } from '@ionic/vue';
import { construct, checkmarkCircle, hourglass, playCircle } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { DatabaseService } from '@/services/DatabaseService';
import type { Voiture } from '@/types/models';

const route = useRoute();
const car = ref<Voiture | null>(null);
const interventions = ref<any[]>([]);
const totalCost = ref(0);
const overallProgress = ref(0);

onMounted(async () => {
  const id = route.params.id as string;
  const voiture = await DatabaseService.getVoitureById(id);
  
  if (voiture) {
    car.value = voiture;
    
    // Fetch all repairs
    const repairs = await DatabaseService.getReparationsByVoiture(id);
    const allTypes = await DatabaseService.getAllTypesIntervention();
    const allStatuts = await DatabaseService.getAllStatuts();
    
    let completedCount = 0;
    const details = [];

    for (const rep of repairs) {
      const typeDef = allTypes.find(t => t.id === rep.type_id);
      
      // Get last status from history
      const history = await DatabaseService.getHistoryByReparation(rep.id || '');
      let statusName = 'En attente';
      if (history.length > 0) {
        history.sort((a, b) => new Date(b.date_statut).getTime() - new Date(a.date_statut).getTime());
        const lastStatus = allStatuts.find(s => s.id === history[0].statut_id);
        if (lastStatus) statusName = lastStatus.nom;
      }

      if (statusName.toLowerCase() === 'terminé' || statusName.toLowerCase() === 'payé') {
        completedCount++;
      }

      details.push({
        id: rep.id,
        name: typeDef?.nom || 'Intervention',
        price: typeDef?.prix || 0,
        status: statusName
      });

      totalCost.value += typeDef?.prix || 0;
    }

    interventions.value = details;
    overallProgress.value = repairs.length > 0 ? Math.round((completedCount / repairs.length) * 100) : 0;
  }
});

const getStatusIcon = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'terminé' || s === 'payé') return checkmarkCircle;
  if (s === 'en cours') return playCircle;
  return hourglass;
};

const getStatusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'terminé' || s === 'payé') return 'success';
  if (s === 'en cours') return 'warning';
  return 'medium';
};

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
