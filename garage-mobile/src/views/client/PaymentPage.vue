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
         <p><strong>Véhicule:</strong> {{ car.modele }}</p>
         <p><strong>Immatriculation:</strong> {{ car.matricule }}</p>
         <div class="total-box">
           <h1>{{ totalCost.toLocaleString() }} Ar</h1>
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
import { DatabaseService } from '@/services/DatabaseService';
import type { Voiture } from '@/types/models';

const route = useRoute();
const router = useRouter();
const car = ref<Voiture | null>(null);
const totalCost = ref(0);
const paymentMethod = ref('card');

onMounted(async () => {
    const id = route.params.id as string;
    const voiture = await DatabaseService.getVoitureById(id);
    
    if (voiture) {
        car.value = voiture;
        // Fetch repairs to calculate total cost
        const repairs = await DatabaseService.getReparationsByVoiture(id);
        const allTypes = await DatabaseService.getAllTypesIntervention();
        
        totalCost.value = repairs.reduce((acc, rep) => {
            const type = allTypes.find(t => t.id === rep.type_id);
            return acc + (type ? type.prix : 0);
        }, 0);
    }
});

const confirmPayment = async () => {
    if (car.value && car.value.id) {
        // Simple loading indicator
        const btn = document.querySelector('ion-button');
        if (btn) btn.disabled = true;

        try {
            // 1. Update repairs status to "Payé"
            const repairs = await DatabaseService.getReparationsByVoiture(car.value.id);
            const statusPaidId = 'nAfHysS0kCpYjgLtoAy3'; // Hardcoded ID as per request
            
            if (statusPaidId) {
                for (const rep of repairs) {
                    // Update main document
                    await DatabaseService.updateReparation(rep.id!, { statut_id: statusPaidId });

                    // Update repair history
                    await DatabaseService.addReparationStatut({
                        reparation_id: rep.id!,
                        statut_id: statusPaidId,
                        date_statut: new Date()
                    });
                }
            }

            // 2. Create Payment Record (New)
            await DatabaseService.createPaiement({
                voiture_id: car.value.id,
                montant: totalCost.value,
                date_paiement: new Date()
            });

            // 3. Clear flags on the car (Notification)
            await DatabaseService.updateVoiture(car.value.id, {
                toutFini: false
            });

            alert('Paiement réussi ! Merci de votre confiance.');
            router.replace('/home');
        } catch (e) {
            console.error("Payment error:", e);
            alert('Erreur lors du paiement.');
            if (btn) btn.disabled = false;
        }
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
