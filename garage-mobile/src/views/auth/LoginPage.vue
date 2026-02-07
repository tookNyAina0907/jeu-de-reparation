<template>
  <ion-page>
    <ion-content class="ion-padding garage-bg">
      <div class="login-container">
        <div class="branding">
          <div class="v1-badge">SIMULATION v1.0</div>
          <h1 class="garage-title main-title">GARAGE</h1>
          <h1 class="garage-title sub-title">SIMULATION</h1>
          <p class="tagline">Système de gestion — Atelier automobile</p>
        </div>

        <div class="form-container garage-card">
          <ion-item class="garage-item">
            <ion-label position="floating">EMAIL</ion-label>
            <ion-input v-model="email" type="email" placeholder="client@test.com"></ion-input>
          </ion-item>
          <ion-item class="garage-item">
            <ion-label position="floating">MOT DE PASSE</ion-label>
            <ion-input v-model="password" type="password" placeholder="password"></ion-input>
          </ion-item>
          
          <div class="ion-padding-top actions">
            <ion-button expand="block" class="garage-button primary" @click="login">
              ACCÈS COMPTE
            </ion-button>
            <ion-button expand="block" fill="clear" class="garage-button secondary" router-link="/register">
              CRÉER UN COMPTE
            </ion-button>
          </div>
        </div>

        <div class="footer-status">
          <div class="status-dot"></div>
          <span>SYSTÈME ACTIF</span>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, toastController, loadingController } from '@ionic/vue';
import { ref } from 'vue';
import { AuthService } from '@/services/AuthService';
import { useRouter } from 'vue-router';

const email = ref('client@test.com');
const password = ref('password');
const router = useRouter();

const login = async () => {
    const loading = await loadingController.create({
        message: 'Connexion...',
    });
    await loading.present();

    const success = await AuthService.login(email.value, password.value);
    
    await loading.dismiss();

    if (success) {
        const toast = await toastController.create({
            message: 'Bienvenue !',
            duration: 2000,
            color: 'success',
            position: 'top'
        });
        await toast.present();
        router.replace('/tabs/home');
    } else {
        const toast = await toastController.create({
            message: 'Email ou mot de passe incorrect',
            duration: 3000,
            color: 'danger',
            position: 'top'
        });
        await toast.present();
    }
};
</script>

<style scoped>
.garage-bg {
  --background: radial-gradient(circle at center, #1e293b 0%, #0b0e14 100%);
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  padding: 20px;
}

.branding {
  text-align: center;
}

.v1-badge {
  border: 1px solid var(--garage-orange);
  color: var(--garage-orange);
  font-size: 0.7rem;
  padding: 2px 8px;
  display: inline-block;
  margin-bottom: 10px;
  font-weight: bold;
}

.main-title {
  font-size: 3rem;
  margin: 0;
  line-height: 1;
  color: #fff;
}

.sub-title {
  font-size: 2.5rem;
  margin: 0;
  color: var(--garage-orange);
  text-shadow: 0 0 10px rgba(255, 94, 0, 0.5);
}

.tagline {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-top: 10px;
}

.form-container {
  width: 100%;
  padding: 20px;
}

.garage-item {
  --background: transparent;
  --color: #fff;
  --highlight-color-focused: var(--garage-orange);
  margin-bottom: 10px;
}

.garage-button.primary {
  --background: var(--garage-orange);
  --color: #fff;
  --border-radius: 4px;
  font-weight: bold;
  height: 50px;
  margin-bottom: 15px;
}

.garage-button.secondary {
  --color: var(--garage-orange);
  --border-color: var(--garage-orange);
  --border-style: solid;
  --border-width: 1px;
  --border-radius: 4px;
  font-weight: bold;
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: bold;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--garage-orange);
  border-radius: 50%;
  box-shadow: 0 0 5px var(--garage-orange);
}
</style>
