/**
 * Données mockées pour le projet Garage Simulation.
 * À remplacer par des appels API Laravel plus tard.
 */

export const INTERVENTION_TYPES = [
  { id: 'frein', label: 'Frein', icon: '🛑', basePrice: 120, baseDuration: 45 },
  { id: 'vidange', label: 'Vidange', icon: '🛢️', basePrice: 80, baseDuration: 30 },
  { id: 'pneu', label: 'Pneu', icon: '🛞', basePrice: 60, baseDuration: 20 },
  { id: 'distribution', label: 'Distribution', icon: '⚙️', basePrice: 350, baseDuration: 120 },
  { id: 'climatisation', label: 'Climatisation', icon: '❄️', basePrice: 90, baseDuration: 40 },
  { id: 'echappement', label: 'Échappement', icon: '💨', basePrice: 180, baseDuration: 60 },
];

export const CLIENTS = [
  { id: 1, nom: 'Martin Dupont', vehicule: 'Peugeot 308', plaque: 'AB-123-CD', tel: '06 12 34 56 78' },
  { id: 2, nom: 'Sophie Bernard', vehicule: 'Renault Clio', plaque: 'EF-456-GH', tel: '06 98 76 54 32' },
  { id: 3, nom: 'Lucas Petit', vehicule: 'Citroën C3', plaque: 'IJ-789-KL', tel: '07 11 22 33 44' },
  { id: 4, nom: 'Emma Rousseau', vehicule: 'Volkswagen Golf', plaque: 'MN-012-OP', tel: '06 55 66 77 88' },
  { id: 5, nom: 'Hugo Moreau', vehicule: 'Ford Fiesta', plaque: 'QR-345-ST', tel: '06 99 88 77 66' },
];

export const REPAIRS_IN_PROGRESS = [
  {
    id: 1,
    clientId: 1,
    clientName: 'Martin Dupont',
    vehicule: 'Peugeot 308',
    plaque: 'AB-123-CD',
    intervention: { type: 'Vidange', price: 80, duration: 30 },
    progress: 65,
    status: 'en_cours',
    startedAt: '2025-01-27T10:00:00',
  },
  {
    id: 2,
    clientId: 2,
    clientName: 'Sophie Bernard',
    vehicule: 'Renault Clio',
    plaque: 'EF-456-GH',
    intervention: { type: 'Frein', price: 120, duration: 45 },
    progress: 30,
    status: 'en_cours',
    startedAt: '2025-01-27T10:30:00',
  },
];

export const WAITING_SLOT = [
  {
    id: 3,
    clientId: 3,
    clientName: 'Lucas Petit',
    vehicule: 'Citroën C3',
    plaque: 'IJ-789-KL',
    intervention: { type: 'Pneu', price: 60, duration: 20 },
    position: 1,
  },
];

export const STATS = {
  repairsToday: 12,
  revenueToday: 1840,
  totalClients: 47,
  avgRepairTime: 38,
};

export const FAKE_USER = {
  login: 'admin',
  password: 'garage2025',
  name: 'Technicien',
};
