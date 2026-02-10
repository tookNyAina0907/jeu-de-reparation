/**
 * Service API — utilisant Firebase.
 * Mappe les collections Firestore (basées sur le schéma SQL) vers les formats du frontend.
 */

import {
  loginUser,
  logoutUser,
  userService,
  voitureService,
  interventionTypeService,
  reparationService,
  statutService,
  getAllDocuments
} from '../firebase/services';

/** Login via Firebase Auth */
export async function login(email, password) {
  const res = await loginUser(email, password);
  if (res.ok) {
    return {
      ok: true,
      user: {
        name: res.user.nom || res.user.displayName || res.user.email,
        login: res.user.email,
        role: res.user.role
      }
    };
  }
  return res;
}

/** Déconnexion */
export async function logout() {
  return await logoutUser();
}

/** Types d'intervention — t_type_interventions */
export async function getInterventionTypes() {
  const data = await interventionTypeService.getAll();
  // Mapping pour le frontend (label, icon, etc.)
  return {
    data: data.map(t => ({
      id: t.id,
      label: t.nom,
      icon: t.nom === 'Vidange' ? '🛢️' : t.nom === 'Freinage' ? '🛑' : '🔧',
      basePrice: t.prix,
      baseDuration: (typeof t.duree === 'string' && t.duree.includes(':'))
        ? (parseInt(t.duree.split(':')[0]) * 3600 + parseInt(t.duree.split(':')[1]) * 60)
        : 3600,
      description: t.description_interventions || ''
    }))
  };
}

/** Liste des véhicules par client — t_users + t_voiture */
export async function getClients() {
  const users = await userService.getAll();
  const voitures = await voitureService.getAll();

  // On retourne la liste des voitures des clients
  const vehicles = voitures
    .map(v => {
      const u = users.find(user => user.id === v.users_id) || { nom: 'Inconnu', role: 'inconnu' };
      if (u.role !== 'client') return null;
      return {
        id: v.id,
        nom: u.nom,
        plaque: v.matricule || 'N/A',
        vehicule: 'Véhicule ' + (v.matricule || ''),
        tel: u.contact || 'N/A'
      };
    })
    .filter(v => v !== null);

  return { data: vehicles };
}

/** Liste des utilisateurs filtrés par rôle (clients par défaut) */
export async function getUsers(role = 'client') {
  const users = await userService.getAll();
  // Si role est null/undefined on retourne tout, sinon on filtre
  const filtered = role ? users.filter(u => u.role === role || (!u.role && role === 'client')) : users;
  return { data: filtered };
}

/** Réparations en cours — t_reparation */
export async function getRepairsInProgress() {
  const reparations = await reparationService.getAll();
  const types = await interventionTypeService.getAll();
  const voitures = await voitureService.getAll();
  const users = await userService.getAll();

  const data = reparations
    .filter(r => r.statut_id !== 'payé' && r.statut_id !== 'Terminé')
    .map(r => {
      const v = voitures.find(vo => vo.id === r.voiture_id) || {};
      const u = users.find(us => us.id === v.users_id) || {};
      const t = types.find(ty => ty.id === r.type_id) || {};

      const progressMap = {
        'En attente': 0,
        'en_attente': 0,
        'En cours': 50,
        'en_cours': 50,
        'Terminé': 100,
        'terminé': 100
      };

      return {
        id: r.id,
        plaque: v.matricule || 'N/A',
        vehicule: 'Véhicule',
        clientName: u.nom || 'Inconnu',
        intervention: {
          type: t.nom || 'Intervention',
          price: t.prix || 0,
          duration: 3600, // de base
          description: t.description_interventions || ''
        },
        progress: progressMap[r.statut_id] !== undefined ? progressMap[r.statut_id] : 0,
        status: r.statut_id
      };
    });

  return { data };
}

/** Slot d'attente (Simulé via les réparations "En attente") */
export async function getWaitingSlot() {
  const reparations = await reparationService.getAll();
  const types = await interventionTypeService.getAll();
  const voitures = await voitureService.getAll();
  const users = await userService.getAll();

  const data = reparations
    .filter(r => r.statut_id === 'En attente' || r.statut_id === 'en_attente')
    .map((r, index) => {
      const v = voitures.find(vo => vo.id === r.voiture_id) || {};
      const u = users.find(us => us.id === v.users_id) || {};
      const t = types.find(ty => ty.id === r.type_id) || {};

      return {
        id: r.id,
        position: index + 1,
        plaque: v.matricule || 'N/A',
        vehicule: 'Véhicule',
        clientName: u.nom || 'Inconnu',
        intervention: {
          type: t.nom || 'Intervention',
          price: t.prix || 0
        }
      };
    });

  return { data };
}

/** Statistiques dashboard */
export async function getStats() {
  const reparations = await reparationService.getAll();
  const users = await userService.getAll();
  const types = await interventionTypeService.getAll();

  const repairsToday = reparations.length;
  // Calcul du revenu basé sur le prix du type d'intervention lié, UNIQUEMENT si Payé
  const revenueToday = reparations.reduce((acc, r) => {
    // Vérification sensible à la casse (Payé/payé)
    if (r.statut_id === 'Payé' || r.statut_id === 'payé') {
      const type = types.find(t => t.id === r.type_id);
      return acc + (type && type.prix ? Number(type.prix) : 0);
    }
    return acc;
  }, 0);

  const totalClients = users.filter(u => u.role === 'client').length;

  return {
    data: {
      repairsToday,
      revenueToday,
      totalClients,
      avgRepairTime: 45 // Valeur simulée ou à calculer si les données le permettent
    }
  };
}

/** Créer un type d'intervention (Catalogue t_type_interventions) */
export async function createInterventionType(payload) {
  const res = await interventionTypeService.create({
    nom: payload.nom,
    prix: payload.price,
    duree: payload.duration,
    description_interventions: payload.description
  });
  return { ok: true, data: res };
}

/** Créer une intervention (Instance t_reparation) */
export async function createIntervention(payload) {
  const res = await reparationService.create({
    voiture_id: payload.voitureId || 'v1',
    type_id: payload.typeId,
    statut_id: 'En attente',
    prix: payload.price,
    date: new Date().toISOString()
  });

  return { ok: true, data: res };
}

/** Mettre à jour une réparation */
export async function updateRepair(id, updates) {
  if (updates.status) {
    await reparationService.updateStatut(id, updates.status);
  }
  return { ok: true };
}

/** Obtenir l'historique des réparations d'un client */
export async function getUserRepairHistory(userId) {
  try {
    // 1. Récupérer les infos de l'utilisateur
    let user = await userService.getById(userId);

    // Si pas trouvé par ID de document, essayer par ID interne (cas des imports SQL)
    if (!user) {
      user = await userService.getByInternalId(userId);
    }

    if (!user) throw new Error("Utilisateur non trouvé");

    // 2. Récupérer les voitures de l'utilisateur
    const cars = await voitureService.getByUser(userId);

    // 3. Récupérer les types d'interventions pour avoir les noms et prix
    const types = await interventionTypeService.getAll();

    // 4. Pour chaque voiture, récupérer ses réparations
    let allRepairs = [];
    for (const car of cars) {
      const repairs = await reparationService.getByVoiture(car.id);

      // Enrichir les réparations avec les détails
      const enrichedRepairs = await Promise.all(repairs.map(async (r) => {
        const type = types.find(t => t.id === r.type_id) || {};

        // Récupérer l'historique des statuts pour avoit la date du dernier statut
        const statusHistory = await reparationService.getHistory(r.id);
        // Trier par date décroissante
        statusHistory.sort((a, b) => new Date(b.date_statut) - new Date(a.date_statut));
        const latestStatus = statusHistory[0];

        return {
          id: r.id,
          type_intervention: type.nom || 'Intervention',
          description: type.description_interventions || '',
          prix: type.prix || 0,
          date: latestStatus ? latestStatus.date_statut : (r.date || r.createdAt),
          voiture: car.matricule || 'Sans plaque',
          statut: r.statut_id
        };
      }));

      allRepairs = [...allRepairs, ...enrichedRepairs];
    }

    // 5. Trier par date décroissante globale
    allRepairs.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      ok: true,
      data: {
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          contact: user.contact
        },
        repairs: allRepairs
      }
    };

  } catch (error) {
    console.error('Erreur getUserRepairHistory (Firebase):', error);
    return { ok: false, error: error.message };
  }
}

// Synchronisation
export const syncDatabase = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur syncDatabase:", error);
    throw error;
  }
};

