.<template>
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
import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonFab, 
    IonFabButton, 
    IonIcon, 
    onIonViewWillEnter, 
    onIonViewDidLeave, 
    alertController 
} from '@ionic/vue';
import { add } from 'ionicons/icons';
import { ref, onUnmounted } from 'vue';
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

             // Check status
             // 1. Try new direct field
             if (rep.statut_id) {
                 const allStatuts = await DatabaseService.getAllStatuts();
                 const statusDef = allStatuts.find(s => s.id === rep.statut_id);
                 if (statusDef) {
                     status = statusDef.nom;
                 }
             } 
             // 2. Fallback to history (for old data)
             else {
                 const history = await DatabaseService.getHistoryByReparation(rep.id || '');
                 if (history.length > 0) {
                     history.sort((a, b) => new Date(b.date_statut).getTime() - new Date(a.date_statut).getTime());
                     const lastStatus = history[0];
                     const allStatuts = await DatabaseService.getAllStatuts();
                     const statusDef = allStatuts.find(s => s.id === lastStatus.statut_id);
                     if (statusDef) status = statusDef.nom;
                 }
             }

             // Map status to progress (Simplified logic)
             if (status === 'En attente') progress = 10;
             else if (status === 'En cours') progress = 50;
             else if (status === 'Terminé') progress = 100;
             else if (status === 'Payé') progress = 100;
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

let unsubscribe: any = null;

const alertedCars = new Set<string>();

const showCompletionAlert = async (car: any) => {
    if (alertedCars.has(car.id)) return;
    alertedCars.add(car.id);
    
    const alert = await alertController.create({
        header: 'Réparations Terminées !',
        subHeader: car.matricule,
        message: `Toutes les réparations pour votre véhicule ${car.modele} sont finies. Vous pouvez maintenant procéder au paiement.`,
        cssClass: 'garage-alert',
        buttons: [
            {
                text: 'Plus tard',
                role: 'cancel'
            },
            {
                text: 'Payer maintenant',
                handler: () => {
                    router.push('/payment/' + car.id);
                }
            }
        ]
    });

    await alert.present();
};

const setupSubscription = () => {
    if (!authState.user) return;

    if (unsubscribe) unsubscribe();

    unsubscribe = DatabaseService.subscribeToUserVoitures(authState.user.uid, async (userCars) => {
        // Enhance cars with repair details
        const enhancedCars = await Promise.all(userCars.map(async (car) => {
            const repairs = await DatabaseService.getReparationsByVoiture(car.id || '');
            
            let progress = 0;
            let serviceName = "Aucune réparation";
            let status = 'En ordre';

            if (repairs.length > 0) {
                const totalRepairs = repairs.length;
                let completedRepairs = 0;

                for (const rep of repairs) {
                    const history = await DatabaseService.getHistoryByReparation(rep.id || '');
                    if (history.length > 0) {
                        history.sort((a, b) => new Date(b.date_statut).getTime() - new Date(a.date_statut).getTime());
                        const lastStatus = history[0];
                        const allStatuts = await DatabaseService.getAllStatuts();
                        const statusDef = allStatuts.find(s => s.id === lastStatus.statut_id);
                        
                        if (statusDef) {
                            const sName = statusDef.nom.toLowerCase();
                            if (sName === 'terminé' || sName === 'payé') {
                                completedRepairs++;
                            }
                        }
                    }
                }

                progress = Math.round((completedRepairs / totalRepairs) * 100);

                // For the label/display, still use the last repair's status
                const lastRep = repairs[repairs.length - 1];
                const allTypes = await DatabaseService.getAllTypesIntervention();
                const typeDef = allTypes.find(t => t.id === lastRep.type_id);
                serviceName = typeDef ? `${typeDef.nom} — ${typeDef.prix} Ar` : "Réparation";

                const lastHistory = await DatabaseService.getHistoryByReparation(lastRep.id || '');
                if (lastHistory.length > 0) {
                    lastHistory.sort((a, b) => new Date(b.date_statut).getTime() - new Date(a.date_statut).getTime());
                    const lastStatusDef = (await DatabaseService.getAllStatuts()).find(s => s.id === lastHistory[0].statut_id);
                    if (lastStatusDef) status = lastStatusDef.nom;
                }
            }

            // Notification logic: 
            // Trigger if toutFini is true OR status is 'Terminé'
            // and we haven't paid yet
            if (((car as any).toutFini || status === 'Terminé' || status === 'terminé') && status !== 'Payé' && status !== 'payé') {
                showCompletionAlert(car);
            }

            return {
                ...car,
                serviceDetail: serviceName,
                progress: progress,
                statusLabel: status
            };
        }));

        // Filter out cars where status is 'Payé'
        cars.value = enhancedCars.filter(c => c.statusLabel !== 'Payé');
    });
};

onIonViewWillEnter(() => {
    setupSubscription();
});

onIonViewDidLeave(() => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
});

onUnmounted(() => {
    if (unsubscribe) unsubscribe();
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
