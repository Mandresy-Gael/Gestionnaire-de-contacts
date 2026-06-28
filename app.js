// ===================================================
// IMPORTATION DES MODULES
// ===================================================

const express = require("express")
// express : framework web qui permet de créer un serveur et gérer les routes HTTP (GET, POST...)

const app = express()
// app : instance du serveur Express. C'est notre application web.

const mysql = require("mysql2")
// mysql2 : module pour communiquer avec la base de données MySQL

const myconnection = require("express-myconnection")
// express-myconnection : middleware qui rend la connexion MySQL disponible
// dans chaque requête via req.getConnection()


// ===================================================
// CONFIGURATION DE LA BASE DE DONNÉES
// ===================================================

const configBdd = {
    host: "localhost",       // adresse du serveur MySQL (ici en local)
    user: "root",            // nom d'utilisateur MySQL
    password: "",            // mot de passe (vide par défaut avec XAMPP/WAMP)
    database: "contacts_db", // nom de la base de données à utiliser
    port: 3306               // port par défaut de MySQL
}


// ===================================================
// MIDDLEWARE (fonctions qui s'exécutent entre la requête et la réponse)
// ===================================================

// Connecte MySQL à Express en mode "pool" : 
// un pool réutilise des connexions existantes au lieu d'en créer une nouvelle à chaque requête → plus performant
app.use(myconnection(mysql, configBdd, "pool"))

// Définit EJS comme moteur de template (permet d'injecter des variables JS dans le HTML)
app.set("view engine", "ejs")

// Indique à Express où trouver les fichiers EJS (dans le dossier "frontend")
app.set("views", "frontend")

// Sert les fichiers statiques (CSS, images...) depuis le dossier "frontend"
app.use(express.static("frontend"))

// Permet à Express de lire les données envoyées par les formulaires HTML (method="post")
// extended: false → utilise le parseur natif (querystring) sans bibliothèques externes
app.use(express.urlencoded({ extended: false }))


// ===================================================
// ROUTE GET /  →  Redirection vers /contacts
// ===================================================
// Quand l'utilisateur visite la racine "/", on le redirige automatiquement vers "/contacts"
app.get("/", (req, res) => {
    res.redirect("/contacts")
})


// ===================================================
// ROUTE GET /contacts  →  Afficher tous les contacts (READ)
// ===================================================
app.get("/contacts", (req, res) => {

    // req.getConnection() : méthode injectée par express-myconnection
    // Elle fournit une connexion active à la BDD dans le callback
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur de connexion BDD :", erreur)
        } else {
            // Requête SQL pour récupérer tous les contacts triés par nom
            // "SELECT *" → sélectionner toutes les colonnes
            // "ORDER BY nom" → trier par ordre alphabétique
            connection.query("SELECT * FROM t_contacts ORDER BY nom", [], (erreur, resultat) => {
                if (erreur) {
                    console.log("Erreur SQL :", erreur)
                } else {
                    // res.render() : génère la page HTML en injectant les données dans le template EJS
                    // "index" → fichier frontend/index.ejs
                    // {resultat} → variable disponible dans le template EJS sous le nom "resultat"
                    res.render("index", { resultat })
                }
            })
        }
    })
})


// ===================================================
// ROUTE POST /ajouter  →  Enregistrer un nouveau contact (CREATE)
// ===================================================
app.post("/ajouter", (req, res) => {

    // req.body : contient toutes les données envoyées par le formulaire HTML
    // Les clés correspondent aux attributs "name" des inputs du formulaire
    let donnee     = req.body
    let nom        = donnee.nom
    let prenom     = donnee.prenom
    let telephone  = donnee.telephone
    let email      = donnee.email
    let adresse    = donnee.adresse
    let categorie  = donnee.categorie

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur de connexion BDD :", erreur)
        } else {
            // INSERT INTO : ajouter une nouvelle ligne dans la table t_contacts
            // Les "?" sont des paramètres préparés (placeholders) pour éviter les injections SQL
            // Le tableau [...] fournit les valeurs qui remplaceront les "?" dans l'ordre
            connection.query(
                "INSERT INTO t_contacts (nom, prenom, telephone, email, adresse, categorie) VALUES (?, ?, ?, ?, ?, ?)",
                [nom, prenom, telephone, email, adresse, categorie],
                (erreur, resultat) => {
                    if (erreur) {
                        console.log("Erreur SQL INSERT :", erreur)
                    } else {
                        // Après l'insertion, on redirige vers la liste des contacts
                        res.redirect("/contacts")
                    }
                }
            )
        }
    })
})


// ===================================================
// ROUTE GET /supprimer/:id  →  Supprimer un contact (DELETE)
// ===================================================
app.get("/supprimer/:id", (req, res) => {

    // req.params.id : récupère la valeur dynamique dans l'URL
    // Ex: si l'URL est "/supprimer/5", alors id = "5"
    let id = req.params.id

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur de connexion BDD :", erreur)
        } else {
            // DELETE FROM : supprime la ligne où l'id correspond
            connection.query("DELETE FROM t_contacts WHERE id = ?", [id], (erreur, resultat) => {
                if (erreur) {
                    console.log("Erreur SQL DELETE :", erreur)
                } else {
                    res.redirect("/contacts")
                }
            })
        }
    })
})


// ===================================================
// ROUTE GET /modifier/:id  →  Afficher le formulaire de modification (READ one)
// ===================================================
app.get("/modifier/:id", (req, res) => {
    let id = req.params.id

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur de connexion BDD :", erreur)
        } else {
            // SELECT avec WHERE id = ? : récupère uniquement le contact avec cet ID
            connection.query("SELECT * FROM t_contacts WHERE id = ?", [id], (erreur, resultat) => {
                if (erreur) {
                    console.log("Erreur SQL SELECT :", erreur)
                } else {
                    if (resultat.length > 0) {
                        // resultat est un tableau ; resultat[0] = le premier (et unique) contact trouvé
                        // On envoie l'objet contact au template sous la variable "contact"
                        res.render("modifier", { contact: resultat[0] })
                    } else {
                        // Si aucun contact trouvé avec cet ID, retour à la liste
                        res.redirect("/contacts")
                    }
                }
            })
        }
    })
})


// ===================================================
// ROUTE POST /modifier/:id  →  Enregistrer les modifications (UPDATE)
// ===================================================
app.post("/modifier/:id", (req, res) => {
    let id        = req.params.id  // ID depuis l'URL
    let donnee    = req.body        // Données du formulaire
    let nom       = donnee.nom
    let prenom    = donnee.prenom
    let telephone = donnee.telephone
    let email     = donnee.email
    let adresse   = donnee.adresse
    let categorie = donnee.categorie

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur de connexion BDD :", erreur)
        } else {
            // UPDATE ... SET : met à jour les colonnes spécifiées
            // WHERE id = ? : uniquement pour le contact avec cet ID (évite de tout modifier)
            // L'ordre des valeurs dans [...] doit correspondre à l'ordre des "?" dans la requête
            connection.query(
                "UPDATE t_contacts SET nom = ?, prenom = ?, telephone = ?, email = ?, adresse = ?, categorie = ? WHERE id = ?",
                [nom, prenom, telephone, email, adresse, categorie, id],
                (erreur, resultat) => {
                    if (erreur) {
                        console.log("Erreur SQL UPDATE :", erreur)
                    } else {
                        res.redirect("/contacts")
                    }
                }
            )
        }
    })
})


// ===================================================
// ROUTE GET /rechercher  →  Rechercher un contact (SEARCH)
// ===================================================
app.get("/rechercher", (req, res) => {

    // req.query : contient les paramètres de l'URL après le "?"
    // Ex: /rechercher?q=Jean  →  req.query.q = "Jean"
    let q = req.query.q || ""

    // "%" + q + "%" : syntaxe SQL pour "contient cette valeur"
    // LIKE '%Jean%' → trouve "Jean", "Jean-Paul", "Marie-Jean", etc.
    let terme = "%" + q + "%"

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur de connexion BDD :", erreur)
        } else {
            // Recherche dans nom, prénom, téléphone ou email avec LIKE
            // "OR" : au moins une des colonnes doit correspondre
            connection.query(
                "SELECT * FROM t_contacts WHERE nom LIKE ? OR prenom LIKE ? OR telephone LIKE ? OR email LIKE ? ORDER BY nom",
                [terme, terme, terme, terme],
                (erreur, resultat) => {
                    if (erreur) {
                        console.log("Erreur SQL SEARCH :", erreur)
                    } else {
                        // On passe aussi "q" au template pour réafficher le terme de recherche dans l'input
                        res.render("index", { resultat, q })
                    }
                }
            )
        }
    })
})


// ===================================================
// DÉMARRAGE DU SERVEUR
// ===================================================

// app.listen(3002) : démarre le serveur sur le port 3002
// (on utilise 3002 pour ne pas entrer en conflit avec cours_js sur 3001)
app.listen(3002, () => {
    console.log("✅ Serveur Contacts démarré sur http://localhost:3002/contacts")
})
