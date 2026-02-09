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
        <h2>{{ userProfile?.nom || (isLoading ? 'Chargement...' : 'Utilisateur') }}</h2>
        <p>{{ userProfile?.email || (isLoading ? 'Chargement...' : authState.user?.email || 'Non connecté') }}</p>
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


        <ion-button expand="block" color="danger" @click="logout">
          Se déconnecter
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/vue';
import { person } from 'ionicons/icons';
import { AuthService, authState } from '@/services/AuthService';
import { DatabaseService } from '@/services/DatabaseService';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import type { User } from '@/types/models';

const router = useRouter();
const userProfile = ref<User | null>(null);
const isLoading = ref(true);

const fetchProfile = async () => {
    if (authState.user) {
        isLoading.value = true;
        try {
            const email = authState.user.email || '';
            const uid = authState.user.uid;

            // Priority 1: Search by exact Email in Firestore
            let profile = await DatabaseService.getUserByEmail(email);
            
            // Priority 2: Search by UID in Firestore (as document ID)
            if (!profile) {
                profile = await DatabaseService.getUserById(uid);
            }

            // Priority 3: Case-insensitive search (if the email was entered differently)
            if (!profile) {
                const allUsers = await DatabaseService.getAllUsers();
                profile = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
            }

            // Fallback: Use Firebase Auth data if Firestore is empty
            if (profile) {
                userProfile.value = profile;
            } else {
                // No profile in Firestore, use Auth info
                console.log("No Firestore profile found for:", email);
                userProfile.value = {
                    email: email,
                    nom: authState.user.displayName || email.split('@')[0] || 'Utilisateur',
                    contact: '',
                    role: 'client'
                } as User;
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            isLoading.value = false;
        }
    } else {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchProfile();
});

// Watch for auth state changes (in case auth is slow)
watch(() => authState.user, (newUser) => {
    if (newUser) fetchProfile();
});

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
