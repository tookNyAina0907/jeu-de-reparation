# Garage Simulation — MR ROJO

Projet S5 Design · Front Web (Backoffice + FrontOffice) · Thème **jeu de simulation de garage automobile**.

---

## 🧩 Stack

- **React** 18 + **Vite** 5
- **React Router** 6
- **SCSS** (variables, modules)
- Données **mockées** · services API fictifs

---

## 📁 Arborescence

```
final/
├── index.html
├── package.json
├── vite.config.js
├── favicon.svg
├── README.md
└── src/
    ├── main.jsx              # Point d'entrée
    ├── App.jsx               # Routes
    ├── data/
    │   └── mockData.js       # Données mockées (clients, réparations, etc.)
    ├── services/
    │   └── api.js            # Services API fictifs (à remplacer par Laravel)
    ├── styles/
    │   ├── variables.scss    # Thème (couleurs, polices)
    │   └── global.scss       # Styles globaux
    ├── components/
    │   ├── Button/
    │   ├── Card/
    │   ├── Layout/
    │   └── ProgressBar/
    └── pages/
        ├── Home/             # Accueil style jeu
        ├── Backoffice/       # Login + Dashboard
        └── FrontOffice/      # Clients, réparations, file d'attente
```

---

## ⚙️ Installation et exécution

### 1. Prérequis sur ton PC

- **Node.js** (LTS recommandé, ex. 18 ou 20)  
  - Téléchargement : [https://nodejs.org](https://nodejs.org)  
  - Vérifier : `node -v` et `npm -v` dans un terminal.
- **npm** (inclus avec Node.js) ou **yarn** si tu préfères.

### 2. Créer le projet (déjà fait)

Le projet est déjà initialisé. Si tu pars de zéro ailleurs :

```bash
npm create vite@latest mon-garage -- --template react
cd mon-garage
```

### 3. Installer les dépendances

Dans le dossier du projet (`final`) :

```bash
cd f:\DOSSIER_S5\MR_ROJO\final
npm install
```

> **En cas d’erreur `ERESOLVE`** : un `.npmrc` avec `legacy-peer-deps=true` est présent. Supprime `node_modules` et `package-lock.json`, puis relance `npm install`.

**Si `npm install` échoue sans message clair** (ou `ENOTCACHED` / log dans `%APPDATA%\npm-cache\_logs`) :

1. Ouvre **CMD** ou **PowerShell** en dehors de Cursor (clic droit → Exécuter en tant qu’administrateur si besoin).
2. Va dans le projet :
   ```bash
   cd f:\DOSSIER_S5\MR_ROJO\final
   ```
3. Nettoie et réinstalle :
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm cache clean --force
   npm config set prefer-offline false
   npm install
   ```
4. Si ça échoue encore, copie **tout** le message d’erreur (pas seulement la dernière ligne) pour diagnostiquer.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173). La page s’ouvre souvent automatiquement.

### 5. Build et preview

- **Compiler / build** :
  ```bash
  npm run build
  ```
  Les fichiers de production sont dans `dist/`.

- **Tester le build en local** :
  ```bash
  npm run preview
  ```
  Puis ouvre l’URL indiquée (souvent [http://localhost:4173](http://localhost:4173)).

---

## 🎮 Pages et parcours

| Page | Route | Description |
|------|--------|-------------|
| **Accueil** | `/` | Hero style jeu, boutons Backoffice + réparations |
| **Backoffice** | `/backoffice` | Login simulé (console garage) |
| **Dashboard** | `/backoffice/dashboard` | Stats, interventions, réparations (max 2) |
| **FrontOffice** | `/frontoffice` | Clients, réparations en cours, slot d’attente (1) |

**Login démo :** `admin` / `garage2025`

---

## ❌ Erreurs courantes et solutions

| Erreur | Cause possible | Solution |
|--------|----------------|----------|
| `npm : commande introuvable` | Node.js non installé ou pas dans le PATH | Installer Node.js, redémarrer le terminal |
| `EACCES` / droits refusés | Permissions npm | Lancer le terminal en tant qu’admin ou corriger les droits du dossier |
| `npm install` échoue (réseau) | Proxy, firewall, registry | `npm config set registry https://registry.npmjs.org/` puis réessayer |
| Port 5173 déjà utilisé | Un autre dev server tourne | Changer le port dans `vite.config.js` (`server.port`) |
| `ERESOLVE` / unable to resolve dependency tree | Conflit de peer dependencies | Supprimer `node_modules` et `package-lock.json`, puis `npm install` (`.npmrc` active `legacy-peer-deps`) |
| `ENOTCACHED` / cache `only-if-cached` / log dans `_logs` | Cache npm ou config offline | Voir la procédure « Si npm install échoue » ci‑dessus (nettoyage + `npm cache clean --force` + `npm config set prefer-offline false`) |
| `ENOSPC` / no space left on device | Disque plein | Libérer de l’espace (corbeille, téléchargements, nettoyage Windows). Option : `npm config set cache "D:\npm-cache"` si un autre disque a de la place. |
| Page blanche après `npm run dev` | Erreur JS / import | Ouvrir la console du navigateur (F12) et corriger l’erreur indiquée |

---

## 🔌 Brancher l’API Laravel plus tard

Aujourd’hui, tout passe par **`src/services/api.js`** et **`src/data/mockData.js`**.

### Étape 1 : Base URL

En Laravel, tu auras par exemple :

- `https://mon-api.com/api`  
ou en local : `http://localhost:8000/api`

Crée un fichier `src/config.js` :

```js
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

Et dans ton projet, un `.env` :

```
VITE_API_URL=http://localhost:8000/api
```

### Étape 2 : Remplacer les appels dans `api.js`

Au lieu de retourner des données mockées, utilise `fetch` (ou `axios`) vers Laravel :

```js
// Exemple : remplacer getClients()
export async function getClients() {
  const res = await fetch(`${API_BASE}/clients`);
  if (!res.ok) throw new Error('Erreur API');
  const data = await res.json();
  return { data };
}
```

Fais de même pour :

- `login` → `POST /api/login` (ou sanctum)
- `getStats` → `GET /api/stats`
- `getRepairsInProgress` → `GET /api/repairs`
- `getWaitingSlot` → `GET /api/waiting`
- `createIntervention` → `POST /api/interventions`
- etc.

### Étape 3 : CORS et auth

- Configure **CORS** côté Laravel pour autoriser ton front (origine, méthodes, headers).
- Si tu utilises **Sanctum** ou des tokens :  
  - stocke le token (ex. `localStorage` ou cookie) ;  
  - envoie-le dans `Authorization: Bearer <token>` pour les routes protégées.

Les **pages et composants** n’ont pas besoin de changer : ils utilisent déjà les fonctions de `api.js`. Tu adaptes uniquement l’implémentation dans `api.js` et la config.

---

## 📜 Scripts npm

| Script | Commande | Rôle |
|--------|----------|------|
| `dev` | `npm run dev` | Serveur de développement |
| `build` | `npm run build` | Build de production (`dist/`) |
| `preview` | `npm run preview` | Prévisualiser le build |

---

## 🎯 Livrables

- [x] Arborescence complète
- [x] Code front (React, Vite, SCSS)
- [x] Accueil immersive (Hero, HUD, boutons)
- [x] Backoffice (login, dashboard, interventions, réparations max 2)
- [x] FrontOffice (clients, réparations, slot d’attente 1)
- [x] Données mockées + services API fictifs
- [x] Thème garage (noir, gris, orange, jaune, rouge) + animations
- [x] Instructions d’installation et de build
- [x] Explication pour brancher l’API Laravel

**MR ROJO** · Projet S5 Design
