<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Inscription</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="register-container">
        <ion-item>
            <ion-label position="floating">Nom complet</ion-label>
            <ion-input v-model="fullName" type="text"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="email" type="email"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label position="floating">Contact</ion-label>
            <ion-input v-model="contact" type="tel" placeholder="034 00 000 00"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label position="floating">Mot de passe</ion-label>
            <ion-input v-model="password" type="password"></ion-input>
        </ion-item>
        <div class="ion-padding-top">
            <ion-button expand="block" @click="register">S'inscrire</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton, toastController, loadingController } from '@ionic/vue';
import { ref } from 'vue';
import { AuthService } from '@/services/AuthService';
import { useRouter } from 'vue-router';

const fullName = ref('');
const email = ref('');
const contact = ref('');
const password = ref('');
const router = useRouter();

const register = async () => {
    if (!fullName.value || !email.value || !password.value || !contact.value) {
        const toast = await toastController.create({
            message: 'Veuillez remplir tous les champs',
            duration: 3000,
            color: 'warning',
            position: 'top'
        });
        await toast.present();
        return;
    }

    const loading = await loadingController.create({
        message: 'Création du compte...',
    });
    await loading.present();

    const success = await AuthService.register({
        fullName: fullName.value,
        email: email.value,
        contact: contact.value,
        password: password.value
    });
    
    await loading.dismiss();

    if (success) {
        const toast = await toastController.create({
            message: 'Compte créé avec succès !',
            duration: 2000,
            color: 'success',
            position: 'top'
        });
        await toast.present();
        router.replace('/tabs/home');
    } else {
        const toast = await toastController.create({
            message: 'Erreur lors de l\'inscription',
            duration: 3000,
            color: 'danger',
            position: 'top'
        });
        await toast.present();
    }
};
</script>

<style scoped>
.register-container {
    padding-top: 20px;
}
</style>
