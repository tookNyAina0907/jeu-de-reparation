<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/mechanic/list"></ion-back-button>
        </ion-buttons>
        <ion-title>Intervention</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" v-if="car">
      
      <ion-card>
        <ion-card-header>
            <ion-card-subtitle>{{ car.licensePlate }}</ion-card-subtitle>
            <ion-card-title>{{ car.model }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <h3>Panne signalée :</h3>
            <p>{{ car.description }}</p>
            
            <h3 class="ion-margin-top">Réparations prévues :</h3>
            <ul>
                <li v-for="repair in car.repairs" :key="repair">{{ repair }}</li>
            </ul>
        </ion-card-content>
      </ion-card>

      <div class="ion-padding-top">
          <ion-item>
              <ion-label position="stacked">Statut</ion-label>
              <ion-select v-model="status" interface="popover">
                  <ion-select-option value="PENDING">En attente</ion-select-option>
                  <ion-select-option value="IN_PROGRESS">En cours</ion-select-option>
                  <ion-select-option value="DONE">Terminé</ion-select-option>
              </ion-select>
          </ion-item>

          <ion-item class="ion-margin-top">
              <ion-label position="stacked">Progression: {{ progress }}%</ion-label>
              <ion-range v-model="progress" :min="0" :max="100" :pin="true" color="tertiary"></ion-range>
          </ion-item>
      </div>

      <div class="ion-padding">
          <ion-button v-if="status === 'PENDING'" expand="block" color="success" class="ion-margin-bottom" @click="startRepair">
              Démarrer la réparation
          </ion-button>
          
          <ion-button v-if="status === 'IN_PROGRESS'" expand="block" color="success" class="ion-margin-bottom" @click="finishRepair">
              Terminer la réparation
          </ion-button>

          <ion-button expand="block" color="tertiary" @click="save">
              Mettre à jour (Manuel)
          </ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonRange, IonButton, toastController } from '@ionic/vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GarageService, Car } from '@/services/MockGarageService';

const route = useRoute();
const router = useRouter();
const car = ref<Car | undefined>(undefined);

const status = ref<string>('PENDING');
const progress = ref<number>(0);

onMounted(async () => {
    const id = Number(route.params.id);
    const foundCar = await GarageService.getCarById(id);
    if (foundCar) {
        car.value = foundCar;
        status.value = foundCar.status;
        progress.value = foundCar.progress;
    }
});

const save = async () => {
    if (car.value) {
        // Validation TS un peu brute pour le status, idéalement utiliser un type guard
        await GarageService.updateStatus(car.value.id, status.value as any, progress.value);
        
        const toast = await toastController.create({
            message: 'Intervention mise à jour',
            duration: 2000,
            color: 'success'
        });
        await toast.present();
        router.back();
    }
};

const startRepair = async () => {
    status.value = 'IN_PROGRESS';
    progress.value = 10;
    await save();
};

const finishRepair = async () => {
    status.value = 'DONE';
    progress.value = 100;
    await save();
};
</script>
