<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mon Profil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="profile-header">
        <div class="avatar-placeholder">
          <ion-icon :icon="person" size="large"></ion-icon>
        </div>
        <h2>Utilisateur</h2>
        <p>client@example.com</p>
      </div>

      <ion-list>
        <ion-item button>
          <ion-label>Paramètres</ion-label>
        </ion-item>
        <ion-item button>
          <ion-label>Aide & Support</ion-label>
        </ion-item>
      </ion-list>
      
      <div class="ion-padding">
        <ion-button expand="block" color="tertiary" router-link="/mechanic/list" class="ion-margin-bottom">
          <ion-icon slot="start" :icon="construct"></ion-icon>
          Accès Atelier (Mécanicien)
        </ion-button>

        <ion-button expand="block" color="danger" @click="logout">
          Se déconnecter
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/vue';
import { person, construct } from 'ionicons/icons';
import { AuthService } from '@/services/MockAuthService';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
    AuthService.logout();
    router.replace('/login');
};
</script>

<style scoped>
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
}
.avatar-placeholder {
  background: #f0f0f0;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
</style>
