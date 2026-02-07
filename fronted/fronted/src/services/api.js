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

/** Liste des utilisateurs bruts (t_users) */
export async function getUsers() {
  const users = await userService.getAll();
  return { data: users };
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
