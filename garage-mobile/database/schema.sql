-- Création des tables pour Garage Mobile
-- SGBD: PostgreSQL

-- 1. Table Utilisateurs
CREATE TABLE t_users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    motdepasse VARCHAR(100) NOT NULL,
    contact VARCHAR(100)
);

-- 2. Table Voitures
CREATE TABLE t_voiture (
    id SERIAL PRIMARY KEY,
    matricule VARCHAR(100) NOT NULL UNIQUE,
    users_id INTEGER NOT NULL,
    CONSTRAINT fk_voiture_user FOREIGN KEY (users_id) REFERENCES t_users(id) ON DELETE CASCADE
);

-- 3. Table Types d'interventions (Catalogue des réparations)
CREATE TABLE t_type_interventions (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description_interventions VARCHAR(500),
    prix DECIMAL(10, 2) NOT NULL,
    duree TIME
);

-- 4. Table Statuts
CREATE TABLE t_statut (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- 5. Table Réparations (Une intervention spécifique sur une voiture)
CREATE TABLE t_reparation (
    id SERIAL PRIMARY KEY,
    voiture_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    CONSTRAINT fk_reparation_voiture FOREIGN KEY (voiture_id) REFERENCES t_voiture(id) ON DELETE CASCADE,
    CONSTRAINT fk_reparation_type FOREIGN KEY (type_id) REFERENCES t_type_interventions(id)
);

-- 6. Table Suivi des Statuts (Historique)
CREATE TABLE t_reparation_statut (
    id SERIAL PRIMARY KEY,
    reparation_id INTEGER NOT NULL,
    statut_id INTEGER NOT NULL,
    date_statut TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_suivi_reparation FOREIGN KEY (reparations_id) REFERENCES t_reparations(id) ON DELETE CASCADE,
    CONSTRAINT fk_suivi_statut FOREIGN KEY (statut_id) REFERENCES t_statut(id)
);

-- Données initiales pour les statuts (Seed)
INSERT INTO t_statut (nom) VALUES ('En attente'), ('En cours'), ('Terminé'), ('Payé');

-- Données initiales pour les types d'interventions (Seed)
INSERT INTO t_type_interventions (nom, description_interventions, prix, duree) VALUES 
('Vidange', 'Vidange complète avec changement de filtre', 50000, '01:00:00'),
('Freinage', 'Changement des plaquettes de frein', 30000, '02:00:00'),
('Moteur', 'Diagnostic et réparation moteur', 100000, '04:00:00');
