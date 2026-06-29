
CREATE DATABASE IF NOT EXISTS contacts_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE contacts_db;

DROP TABLE IF EXISTS t_contacts;

CREATE TABLE t_contacts (

    id INT AUTO_INCREMENT PRIMARY KEY,
    nom        VARCHAR(100) NOT NULL,
    prenom     VARCHAR(100) NOT NULL,
    telephone  VARCHAR(20)  NOT NULL,
    email      VARCHAR(150) DEFAULT NULL,
    adresse    VARCHAR(255) DEFAULT NULL,

    categorie  ENUM('Famille', 'Ami', 'Collègue', 'Client', 'Autre') DEFAULT 'Autre',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO t_contacts (nom, prenom, telephone, email, adresse, categorie) VALUES
('Dupont',   'Jean',    '06 12 34 56 78', 'jean.dupont@email.com',   '12 Rue de la Paix, Paris',      'Ami'),
('Martin',   'Sophie',  '07 98 76 54 32', 'sophie.martin@gmail.com', '5 Avenue des Roses, Lyon',      'Famille'),
('Bernard',  'Pierre',  '06 55 44 33 22', 'p.bernard@entreprise.fr', '8 Bd Haussmann, Paris',          'Collègue'),
('Leroy',    'Marie',   '06 11 22 33 44', NULL,                      '3 Rue du Port, Marseille',       'Client'),
('Moreau',   'Lucas',   '07 66 77 88 99', 'lucas.moreau@yahoo.fr',   NULL,                             'Ami');

SELECT * FROM t_contacts;
