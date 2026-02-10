<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Dépot Véhicule</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Modèle de voiture</ion-label>
        <ion-input v-model="car.model" placeholder="Ex: Peugeot 208"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Immatriculation</ion-label>
        <ion-input v-model="car.licensePlate" placeholder="Ex: 1234 TAB"></ion-input>
      </ion-item>
      
        <ion-item>
          <ion-label position="stacked">Services suggérés (Optionnel)</ion-label>
          <ion-select v-model="car.repairs" :multiple="true" placeholder="Sélectionner">
            <ion-select-option v-for="type in availableTypes" :key="type.id" :value="type.nom">
              {{ type.nom }} ({{ type.prix }} Ar)
            </ion-select-option>
          </ion-select>
        </ion-item>

      <div class="ion-padding-top">
        <ion-button expand="block" @click="submit">Valider le dépôt</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonButtons, IonBackButton, IonSelect, IonSelectOption, toastController, loadingController } from '@ionic/vue';
import { reactive, onMounted, ref } from 'vue';
import { DatabaseService } from '@/services/DatabaseService';
import { authState } from '@/services/AuthService';
import { useRouter } from 'vue-router';
import type { TypeIntervention } from '@/types/models';

const router = useRouter();
const car = reactive({
  model: '',
  licensePlate: '',
  repairs: [] as string[]
});
const availableTypes = ref<TypeIntervention[]>([]);

onMounted(async () => {
    availableTypes.value = await DatabaseService.getAllTypesIntervention();
});

const submit = async () => {
    if (!authState.isAuthenticated || !authState.user) {
         const toast = await toastController.create({
            message: 'Vous devez être connecté.',
            duration: 3000,
            color: 'danger',
            position: 'top'
        });
        await toast.present();
        return;
    }

  if (car.model && car.licensePlate) {
    const loading = await loadingController.create({
        message: 'Enregistrement...',
    });
    await loading.present();

    try {
        // 1. Create or Get Voiture
        // Check if exists
        let voitureId = '';
        const cars = await DatabaseService.getVoituresByUser(authState.user.uid);
        const existingCar = cars.find(c => c.matricule.toLowerCase() === car.licensePlate.toLowerCase());
        
        if (existingCar && existingCar.id) {
            voitureId = existingCar.id;
        } else {
            voitureId = await DatabaseService.createVoiture({
                matricule: car.licensePlate,
                modele: car.model,
                users_id: authState.user.uid
            });
        }

        // 2. Create Reparations
        // Map selections to Type IDs. 
        // Simple mapping heuristic: find type by name containing selection
        for (const typeName of car.repairs) {
            let typeId = '';
            // Try exact match or partial match
            const match = availableTypes.value.find(t => 
                t.nom.toLowerCase().includes(typeName.toLowerCase()) || 
                typeName.toLowerCase().includes(t.nom.toLowerCase())
            );

            if (match && match.id) {
                typeId = match.id;
            } else {
                // Return default 'Moteur' or first available if no match
                // In real app, ensure types exist.
                 const defaultType = availableTypes.value.find(t => t.nom === 'Moteur') || availableTypes.value[0];
                 if(defaultType && defaultType.id) typeId = defaultType.id;
            }

            if (typeId) {
                const repId = await DatabaseService.createReparation({
                    voiture_id: voitureId,
                    type_id: typeId
                });

                // 3. Add Status (En attente)
                 const statusEnAttente = await DatabaseService.getStatutByName('En attente');
                 if (statusEnAttente && statusEnAttente.id) {
                     await DatabaseService.addReparationStatut({
                         reparation_id: repId,
                         statut_id: statusEnAttente.id!,
                         date_statut: new Date()
                     });
                 }
            }
        }

        await loading.dismiss();
        const toast = await toastController.create({
            message: 'Véhicule déposé avec succès !',
            duration: 2000,
            color: 'success',
            position: 'bottom'
        });
        await toast.present();
        router.replace('/tabs/home'); // Go to Dashboard instead of list for now

    } catch (e) {
        console.error("Error creating breakdown:", e);
        await loading.dismiss();
         const toast = await toastController.create({
            message: 'Erreur lors de l\'enregistrement.',
            duration: 3000,
            color: 'danger',
            position: 'top'
        });
        await toast.present();
    }

  } else {
    const toast = await toastController.create({
        message: 'Veuillez remplir l\'immatriculation',
        duration: 3000,
        color: 'warning',
        position: 'top'
    });
    await toast.present();
  }
};
</script>
