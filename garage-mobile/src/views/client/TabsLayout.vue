<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="cars" href="/tabs/cars">
          <ion-icon :icon="carSport" />
          <ion-label>Voiture</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon :icon="person" />
          <ion-label>Profil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
import { home, carSport, person } from 'ionicons/icons';
</script>
