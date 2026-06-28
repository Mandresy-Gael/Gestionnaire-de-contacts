-- =====================================================
-- BASE DE DONNÉES : contacts_db
-- Gestionnaire de contacts CRUD
-- =====================================================

-- Crée la base de données si elle n'existe pas déjà
-- CHARACTER SET utf8mb4 : supporte tous les caractères (emojis, accents, arabes, etc.)
-- COLLATE utf8mb4_unicode_ci : tri insensible à la casse et aux accents
CREATE DATABASE IF NOT EXISTS contacts_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Sélectionne la base de données à utiliser
USE contacts_db;

-- =====================================================
-- TABLE : t_contacts
-- =====================================================

-- Supprime la table si elle existe déjà (utile pour réinitialiser)
DROP TABLE IF EXISTS t_contacts;

CREATE TABLE t_contacts (

    -- id : clé primaire, auto-incrémentée
    -- AUTO_INCREMENT : MySQL génère automatiquement un ID unique pour chaque nouveau contact
    -- PRIMARY KEY : identifiant unique de chaque ligne (obligatoire)
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- nom et prenom : champs obligatoires (NOT NULL = ne peut pas être vide)
    -- VARCHAR(100) : chaîne de caractères de 100 caractères max
    nom        VARCHAR(100) NOT NULL,
    prenom     VARCHAR(100) NOT NULL,

    -- telephone : obligatoire, VARCHAR car peut contenir des espaces, tirets, +
    telephone  VARCHAR(20)  NOT NULL,

    -- email : optionnel (pas de NOT NULL), DEFAULT NULL = valeur par défaut si non fourni
    email      VARCHAR(150) DEFAULT NULL,

    -- adresse : optionnel, texte libre
    adresse    VARCHAR(255) DEFAULT NULL,

    -- categorie : liste fixe de valeurs possibles via ENUM
    -- ENUM garantit qu'on ne peut insérer que l'une des valeurs listées
    -- DEFAULT 'Autre' : si l'utilisateur ne choisit rien, la catégorie est "Autre"
    categorie  ENUM('Famille', 'Ami', 'Collègue', 'Client', 'Autre') DEFAULT 'Autre',

    -- date_creation : enregistre automatiquement la date et l'heure d'ajout du contact
    -- CURRENT_TIMESTAMP : valeur par défaut = date/heure exacte de l'insertion
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ENGINE=InnoDB : moteur de stockage MySQL qui supporte les transactions et les clés étrangères


-- =====================================================
-- DONNÉES DE TEST (optionnel)
-- Quelques contacts exemples pour tester l'application
-- =====================================================

INSERT INTO t_contacts (nom, prenom, telephone, email, adresse, categorie) VALUES
('Dupont',   'Jean',    '06 12 34 56 78', 'jean.dupont@email.com',   '12 Rue de la Paix, Paris',      'Ami'),
('Martin',   'Sophie',  '07 98 76 54 32', 'sophie.martin@gmail.com', '5 Avenue des Roses, Lyon',      'Famille'),
('Bernard',  'Pierre',  '06 55 44 33 22', 'p.bernard@entreprise.fr', '8 Bd Haussmann, Paris',          'Collègue'),
('Leroy',    'Marie',   '06 11 22 33 44', NULL,                      '3 Rue du Port, Marseille',       'Client'),
('Moreau',   'Lucas',   '07 66 77 88 99', 'lucas.moreau@yahoo.fr',   NULL,                             'Ami');


-- Vérification : afficher les contacts insérés
SELECT * FROM t_contacts;
