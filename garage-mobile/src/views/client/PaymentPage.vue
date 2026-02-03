<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Paiement</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
       <div class="payment-container" v-if="car">
         <h2>Facture</h2>
         <p><strong>Véhicule:</strong> {{ car.model }}</p>
         <p><strong>Immatriculation:</strong> {{ car.licensePlate }}</p>
         <div class="total-box">
           <h1>{{ car.totalCost.toLocaleString() }} Ar</h1>
         </div>

         <ion-list>
           <ion-radio-group v-model="paymentMethod">
             <ion-list-header>Moyen de paiement</ion-list-header>
             <ion-item>
               <ion-label>Carte Bancaire</ion-label>
               <ion-radio slot="start" value="card"></ion-radio>
             </ion-item>
             <ion-item>
               <ion-label>Mobile Money</ion-label>
               <ion-radio slot="start" value="mobile"></ion-radio>
             </ion-item>
             <ion-item>
               <ion-label>Espèces (au garage)</ion-label>
               <ion-radio slot="start" value="cash"></ion-radio>
             </ion-item>
           </ion-radio-group>
         </ion-list>

         <div class="ion-padding-top">
           <ion-button expand="block" @click="confirmPayment">Confirmer le paiement</ion-button>
         </div>
       </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonList, IonListHeader, IonItem, IonLabel, IonRadioGroup, IonRadio } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GarageService, Car } from '@/services/MockGarageService';

const route = useRoute();
const router = useRouter();
const car = ref<Car | undefined>(undefined);
const paymentMethod = ref('card');

onMounted(async () => {
    const id = Number(route.params.id);
    car.value = await GarageService.getCarById(id);
});

const confirmPayment = async () => {
    if (car.value) {
        // Simulation API Call
        await new Promise(resolve => setTimeout(resolve, 1000));
        await GarageService.pay(car.value.id);
        alert('Paiement réussi !');
        router.replace('/home');
    }
};
</script>

<style scoped>
.total-box {
    background: #f0f0f0;
    padding: 20px;
    text-align: center;
    border-radius: 10px;
    margin: 20px 0;
}
.total-box h1 {
    margin: 0;
    color: var(--ion-color-primary);
}
</style>
