// ==========================================
// COMORETECH - SCRIPT.JS
// ==========================================

const SUPABASE_URL =
"https://wevngkvljcctclilbnim.supabase.co";

const SUPABASE_KEY =
"sb_publishable_Hu_ehmjppmxnDCn-7wbeTA_oCcyrdCV";


// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ ComoreTech : script.js chargé");

    const formulaire =
        document.getElementById("commandeForm");

    const dateInput =
        document.getElementById("date");


    // Date minimum = aujourd'hui
    if (dateInput) {

        const aujourdHui = new Date();

        const annee =
            aujourdHui.getFullYear();

        const mois =
            String(aujourdHui.getMonth() + 1)
            .padStart(2, "0");

        const jour =
            String(aujourdHui.getDate())
            .padStart(2, "0");

        dateInput.min =
            `${annee}-${mois}-${jour}`;
    }


    // Service choisi depuis l'URL
    const params =
        new URLSearchParams(window.location.search);

    const serviceURL =
        params.get("service");

    const service =
        document.getElementById("service");


    if (serviceURL && service) {

        const services = {

            site: "Création de sites web",

            video: "Montage vidéo",

            design: "Design graphique",

            digital: "Solutions numériques"

        };

        if (services[serviceURL]) {

            service.value =
                services[serviceURL];
        }
    }


    // Formulaire
    if (formulaire) {

        formulaire.addEventListener(
            "submit",
            envoyerCommande
        );

        console.log(
            "✅ Formulaire connecté"
        );

    } else {

        console.error(
            "❌ commandeForm introuvable"
        );
    }

});


// ==========================================
// ENVOI DE LA COMMANDE
// ==========================================

async function envoyerCommande(e) {

    e.preventDefault();

    console.log(
        "📤 Envoi de la commande..."
    );


    const service =
        document.getElementById("service").value;

    const nom =
        document.getElementById("nom").value.trim();

    const whatsapp =
        document.getElementById("whatsapp").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const date =
        document.getElementById("date").value;

    const description =
        document.getElementById("description").value.trim();

    const acceptation =
        document.getElementById("acceptation");


    // Vérification
    if (
        !service ||
        !nom ||
        !whatsapp ||
        !email ||
        !date ||
        !description
    ) {

        afficherResultat(
            "⚠️ Merci de remplir tous les champs obligatoires.",
            "erreur"
        );

        return;
    }


    if (
        acceptation &&
        !acceptation.checked
    ) {

        afficherResultat(
            "⚠️ Tu dois confirmer les informations.",
            "erreur"
        );

        return;
    }


    // Référence unique
    const reference =
        "CT-" + Date.now();


    // Bouton
    const bouton =
        document.querySelector(
            '#commandeForm button[type="submit"]'
        );


    if (bouton) {

        bouton.disabled = true;

        bouton.textContent =
            "Envoi en cours...";
    }


    // Données envoyées à Supabase
    const commande = {

        reference: reference,

        service: service,

        nom: nom,

        whatsapp: whatsapp,

        email: email,

        date_souhaitee: date,

        description: description,

        statut: "Nouvelle",

        paiement: "En attente"

    };


    try {

        const reponse = await fetch(

            SUPABASE_URL +
            "/rest/v1/commandes",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,

                    "Prefer":
                        "return=representation"

                },

                body:
                    JSON.stringify(commande)

            }

        );


        const texte =
            await reponse.text();


        console.log(
            "Réponse Supabase :",
            texte
        );


        if (!reponse.ok) {

            throw new Error(
                texte ||
                "Erreur Supabase"
            );
        }


        // SUCCÈS 🎉
        afficherResultat(

            "✅ <strong>Commande envoyée !</strong><br><br>" +

            "Ta demande a bien été reçue.<br><br>" +

            "Référence : <strong>" +
            reference +
            "</strong>",

            "succes"

        );


        document
            .getElementById("commandeForm")
            .reset();


        console.log(
            "🎉 Commande enregistrée !"
        );


    } catch (erreur) {

        console.error(
            "❌ ERREUR SUPABASE :",
            erreur
        );


        afficherResultat(

            "❌ <strong>Impossible d'envoyer la commande.</strong><br><br>" +

            "Détails : " +
            erreur.message,

            "erreur"

        );

    }


    // Réactiver le bouton
    if (bouton) {

        bouton.disabled = false;

        bouton.textContent =
            "Envoyer ma demande →";

    }

}


// ==========================================
// AFFICHAGE DU MESSAGE
// ==========================================

function afficherResultat(
    message,
    type
) {

    const resultat =
        document.querySelector(
            ".commande-resultat"
        );


    if (!resultat) {

        alert(
            message
            .replace(/<br>/g, "\n")
            .replace(/<[^>]*>/g, "")
        );

        return;
    }


    resultat.innerHTML =
        message;


    resultat.className =
        "commande-resultat " +
        type;


    resultat.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}