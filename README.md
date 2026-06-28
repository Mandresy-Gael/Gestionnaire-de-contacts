# 👥 Gestionnaire de Contacts - Projet CRUD

Ce projet est une application web simple et moderne de gestion de contacts. Elle permet de lister, rechercher, ajouter, modifier et supprimer des contacts (opérations CRUD) dans une base de données MySQL.

L'interface a été entièrement modernisée avec **Tailwind CSS** et personnalisée selon une charte graphique unique.

---

## 🎨 Design & Identité Visuelle

Pour donner un aspect premium et moderne (effet "glassmorphism"), le projet utilise une palette de couleurs et des typographies précises :

### 1. Palette de Couleurs
*   **Fond principal (Nuit) :** `#0D0D1A` (Un bleu/noir très profond)
*   **Fond des cartes (Marine) :** `#1A1A2E` (Un bleu foncé pour les zones de contenu)
*   **Accents (Or) :** `#C9A96E` (Utilisé pour les boutons principaux, bordures et éléments clés)
*   **Texte (Crème) :** `#E8E0D0` (Un blanc cassé doux pour une lecture agréable)
*   **Titres (Blanc pur) :** `#FFFFFF`

### 2. Typographies (Google Fonts)
*   **Titres & Logo :** *Cormorant Garamond* (Donne un style élégant et académique)
*   **Interface & Textes :** *DM Sans* (Une police moderne sans-serif très lisible)
*   **Détails techniques & Badges :** *Space Grotesk* (Pour les petits détails et les compteurs)

---

## 🛠️ Technologies Utilisées

### Backend (Serveur)
*   **Node.js & Express :** Pour créer le serveur web et gérer les routes de l'application.
*   **EJS (Embedded JavaScript) :** Le moteur de template pour générer le code HTML côté serveur en y injectant dynamiquement les données de notre base de données.
*   **mysql2 & express-myconnection :** Pour connecter notre serveur à la base de données MySQL et faire des requêtes (SELECT, INSERT, UPDATE, DELETE).

### Frontend (Interface)
*   **Tailwind CSS :** Framework CSS pour concevoir l'interface directement dans les fichiers HTML sans avoir à écrire un gros fichier CSS séparé.
*   **Animations CSS :** Effets de transition sur les boutons et apparition progressive (fade-up) des lignes du tableau de contacts au chargement de la page.

---

## 📁 Structure du Projet

Le projet respecte une structure simple et claire :
*   `app.js` : Le point d'entrée de notre serveur Express. C'est ici que sont définies les routes (`/contacts`, `/ajouter`, `/modifier`, `/supprimer`, `/rechercher`).
*   `database.sql` : Le fichier de script SQL pour créer la table de base de données.
*   `package.json` : Fichier de configuration de Node.js qui liste nos dépendances (express, ejs, mysql2, nodemon).
*   `frontend/` : Dossier contenant la partie visible du site.
    *   `index.ejs` : La page d'accueil (formulaire d'ajout + liste des contacts + barre de recherche).
    *   `modifier.ejs` : Le formulaire de modification d'un contact existant.
    *   `style.css` : Fichier vide (non utilisé car Tailwind gère tout, mais laissé pour la structure d'origine).

---

## 🚀 Comment lancer le projet en local

1.  Activez les modules **Apache** et **MySQL** dans votre panneau de contrôle XAMPP ou WAMP.
2.  Importez le fichier `database.sql` dans votre outil de gestion de base de données (comme phpMyAdmin) pour créer la base `contacts_db` et la table `t_contacts`.
3.  Ouvrez un terminal dans le dossier du projet et installez les dépendances nécessaires :
    ```bash
    npm install
    ```
4.  Lancez le serveur avec Nodemon (recharge automatiquement le serveur en cas de modification) :
    ```bash
    npm start
    ```
5.  Ouvrez votre navigateur et allez sur : [http://localhost:3002/contacts](http://localhost:3002/contacts)
