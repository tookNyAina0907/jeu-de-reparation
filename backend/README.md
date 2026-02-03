# API Gestion de Réparations Automobiles

## Installation

1. Installer les dépendances PHP :
```bash
composer install
```

2. Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

3. Générer la clé d'application :
```bash
php artisan key:generate
```

4. Configurer la base de données dans le fichier `.env`

5. Exécuter les migrations :
```bash
php artisan migrate
```

6. Exécuter les seeders :
```bash
php artisan db:seed --class=StatutSeeder
```

7. Démarrer le serveur :
```bash
php artisan serve
```

## Routes API

### Authentification
- `POST /api/signup` - Inscription
- `POST /api/login` - Connexion
- `POST /api/logout` - Déconnexion (protégé)
- `GET /api/me` - Utilisateur connecté (protégé)

### Interventions
- `GET /api/interventions` - Liste des interventions
- `POST /api/interventions` - Créer une intervention
- `GET /api/interventions/{id}` - Détails d'une intervention
- `PUT /api/interventions/{id}` - Modifier une intervention
- `DELETE /api/interventions/{id}` - Supprimer une intervention

### Voitures
- `GET /api/voitures` - Liste des voitures
- `GET /api/voitures/en-cours` - Voitures en cours de réparation
- `POST /api/voitures` - Créer une voiture
- `GET /api/voitures/{id}` - Détails d'une voiture

### Réparations
- `GET /api/reparations` - Liste des réparations
- `POST /api/reparations` - Créer une réparation
- `PUT /api/reparations/{id}` - Modifier une réparation
- `DELETE /api/reparations/{id}` - Supprimer une réparation

### Statuts
- `GET /api/statuts` - Liste des statuts

### Dashboard
- `GET /api/dashboard` - Statistiques du tableau de bord
