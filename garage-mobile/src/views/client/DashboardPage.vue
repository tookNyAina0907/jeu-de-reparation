<template>
  <ion-page>
    <ion-content class="ion-padding garage-bg">
      <!-- Header Welcome -->
      <div class="welcome-header">
        <div class="user-info">
          <p class="greeting">Bonjour,</p>
          <h1 class="user-name">{{ userName }}</h1>
        </div>
        <ion-avatar class="user-avatar">
          <img src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </ion-avatar>
      </div>

      <!-- Hero Action -->
      <div class="hero-action garage-card" @click="router.push('/add-car')">
        <div class="hero-content">
          <h2 class="hero-title">Besoin d'une réparation ?</h2>
          <p class="hero-subtitle">Signalez votre problème en quelques secondes.</p>
          <ion-button fill="clear" class="hero-btn">
            DÉCLARER MAINTENANT <ion-icon :icon="arrowForward" slot="end"></ion-icon>
          </ion-button>
        </div>
        <ion-icon :icon="build" class="hero-icon"></ion-icon>
      </div>

      <!-- Services Grid -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">NOS SERVICES</h3>
        </div>
        <div class="services-grid">
          <div v-for="service in displayedServices" :key="service.id" class="service-item">
            <div class="service-icon-bg">
                <ion-icon :icon="construct"></ion-icon>
            </div>
            <span>{{ service.nom }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Vehicle Status -->
      <div class="section" v-if="activeCar">
        <div class="section-header">
          <h3 class="section-title">DERNIER VÉHICULE</h3>
          <ion-button fill="clear" size="small" color="primary" router-link="/tabs/cars">VOIR TOUT</ion-button>
        </div>
        <div class="garage-card status-preview-card" @click="router.push('/tabs/cars')">
            <div class="status-top">
                <span class="plate">{{ activeCar.matricule }}</span>
                <ion-badge color="warning">{{ currentStatus }}</ion-badge>
            </div>
            <p class="model">{{ activeCar.modele }}</p>
            <div class="progress-mini-container">
                <div class="progress-mini-fill" style="width: 65%"></div>
            </div>
        </div>
      </div>
      <div class="section" v-else>
         <div class="section-header">
          <h3 class="section-title">BIENVENUE</h3>
        </div>
        <div class="garage-card status-preview-card" @click="router.push('/add-car')">
            <p style="color: #94a3b8; text-align: center; margin: 10px;">Aucun véhicule enregistré. <br> Cliquez pour ajouter.</p>
        </div>
      </div>

      <!-- Promo Banner -->
      <div class="promo-banner garage-card">
        <div class="promo-text">
            <h4>OFFRE SPÉCIALE</h4>
            <p> -20% sur la vidange ce mois-ci !</p>
        </div>
        <ion-icon :icon="gift" class="promo-icon"></ion-icon>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonAvatar, IonIcon, IonButton, IonBadge, onIonViewWillEnter } from '@ionic/vue';
import { arrowForward, build, carSport, construct, flask, colorWand, gift } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { authState } from '@/services/AuthService';
import { DatabaseService } from '@/services/DatabaseService';
import type { User, Voiture, Reparation } from '@/types/models';

const router = useRouter();
const userName = ref('Client');
const activeCar = ref<Voiture | null>(null);
const currentStatus = ref('Aucun');

const displayedServices = ref<any[]>([]);

onIonViewWillEnter(async () => {
    // Fetch Services
    try {
        const types = await DatabaseService.getAllTypesIntervention();
        // Limit to 4 for the dashboard preview
        displayedServices.value = types.slice(0, 4);
    } catch (e) {
        console.error("Error fetching services:", e);
    }

    if (authState.user) {
        // Fetch User Profile
        // Try getting by email first as we store extra data there, or use auth display name
        const profile = await DatabaseService.getUserByEmail(authState.user.email || '');
        if (profile) {
            userName.value = profile.nom;
        } else {
            userName.value = authState.user.displayName || 'Client';
        }

        // Fetch User's Cars and check for active reparations
        try {
            const cars = await DatabaseService.getVoituresByUser(authState.user.uid);
            if (cars.length > 0) {
                // Determine which car to show (e.g., the one with the most recent active reparation)
                // For simplicity, let's just pick the first one with an active repair or just the first car
                activeCar.value = cars[0];
                
                // Check repairs for this car
                if (activeCar.value.id) {
                    const repairs = await DatabaseService.getReparationsByVoiture(activeCar.value.id);
                    if (repairs.length > 0) {
                        // TODO: Ideally fetch the status details. For now, just show "En cours" if repairs exist.
                        currentStatus.value = "En cours";
                    } else {
                        currentStatus.value = "En ordre";
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    }
});
</script>

<style scoped>
.garage-bg {
  --background: #0b0e14;
}

/* Header */
.welcome-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    margin-top: 10px;
}

.greeting {
    color: #64748b;
    margin: 0;
    font-size: 0.9rem;
}

.user-name {
    color: #fff;
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
}

.user-avatar {
    width: 45px;
    height: 45px;
    border: 2px solid var(--garage-orange);
}

/* Hero Action */
.hero-action {
    position: relative;
    padding: 20px;
    margin-bottom: 30px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
    display: flex;
    align-items: center;
}

.hero-content {
    flex: 1;
    z-index: 1;
}

.hero-title {
    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
}

.hero-subtitle {
    color: #94a3b8;
    font-size: 0.85rem;
    margin: 8px 0 15px 0;
}

.hero-btn {
    --color: var(--garage-orange);
    font-weight: bold;
    font-size: 0.85rem;
    padding: 0;
    margin: 0;
    --padding-start: 0;
}

.hero-icon {
    font-size: 5rem;
    color: var(--garage-orange);
    opacity: 0.15;
    position: absolute;
    right: -10px;
    bottom: -10px;
}

/* Sections */
.section {
    margin-bottom: 30px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.section-title {
    color: #fff;
    font-size: 0.9rem;
    font-weight: bold;
    letter-spacing: 1px;
    margin: 0;
}

/* Services Grid */
.services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
}

.service-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.service-icon-bg {
    width: 55px;
    height: 55px;
    background: rgba(255, 94, 0, 0.1);
    border: 1px solid rgba(255, 94, 0, 0.2);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--garage-orange);
    font-size: 1.5rem;
}

.service-item span {
    color: #94a3b8;
    font-size: 0.7rem;
    font-weight: 500;
}

/* Status Preview Card */
.status-preview-card {
    padding: 15px;
}

.status-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.plate {
    color: var(--garage-orange);
    font-weight: bold;
    font-size: 1rem;
}

.model {
    color: #fff;
    font-size: 0.85rem;
    margin: 0 0 12px 0;
}

.progress-mini-container {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.progress-mini-fill {
    height: 100%;
    background: var(--garage-orange);
}

/* Promo Banner */
.promo-banner {
    background: linear-gradient(90deg, #ff5e00 0%, #ff8c00 100%);
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;
}

.promo-text h4 {
    color: #fff;
    margin: 0;
    font-weight: bold;
    font-size: 0.9rem;
}

.promo-text p {
    color: rgba(255, 255, 255, 0.9);
    margin: 4px 0 0 0;
    font-size: 0.75rem;
}

.promo-icon {
    font-size: 2rem;
    color: #fff;
    opacity: 0.5;
}
</style>
