
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
    host: "localhost",       
    user: "root",            
    password: "",            
    database: "contacts_db", 
    port: 3306               
}


// ===================================================
// MIDDLEWARE (fonctions qui s'exécutent entre la requête et la réponse)
// ===================================================

app.use(myconnection(mysql, configBdd, "pool"))
app.set("view engine", "ejs")
app.set("views", "frontend")
app.use(express.static("frontend"))
app.use(express.urlencoded({ extended: false }))


// ===================================================
// ROUTE GET /  →  Redirection vers /contacts
// ===================================================

app.get("/", (req, res) => {
    res.redirect("/contacts")
})


// ===================================================
// ROUTE GET /contacts  →  Afficher tous les contacts (READ)
// ===================================================
app.get("/contacts", (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur de connexion BDD :", erreur)
        } else {
            connection.query("SELECT * FROM t_contacts ORDER BY nom", [], (erreur, resultat) => {
                if (erreur) {
                    console.log("Erreur SQL :", erreur)
                } else {
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
            connection.query(
                "INSERT INTO t_contacts (nom, prenom, telephone, email, adresse, categorie) VALUES (?, ?, ?, ?, ?, ?)",
                [nom, prenom, telephone, email, adresse, categorie],
                (erreur, resultat) => {
                    if (erreur) {
                        console.log("Erreur SQL INSERT :", erreur)
                    } else {
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

    let id = req.params.id

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur de connexion BDD :", erreur)
        } else {
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
            connection.query("SELECT * FROM t_contacts WHERE id = ?", [id], (erreur, resultat) => {
                if (erreur) {
                    console.log("Erreur SQL SELECT :", erreur)
                } else {
                    if (resultat.length > 0) {
                        res.render("modifier", { contact: resultat[0] })
                    } else {
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
    let id        = req.params.id  
    let donnee    = req.body       
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
    let q = req.query.q || ""
    let terme = "%" + q + "%"

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur de connexion BDD :", erreur)
        } else {
            connection.query(
                "SELECT * FROM t_contacts WHERE nom LIKE ? OR prenom LIKE ? OR telephone LIKE ? OR email LIKE ? ORDER BY nom",
                [terme, terme, terme, terme],
                (erreur, resultat) => {
                    if (erreur) {
                        console.log("Erreur SQL SEARCH :", erreur)
                    } else {
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

app.listen(3002, () => {
    console.log("✅ Serveur Contacts démarré sur http://localhost:3002/contacts")
})
