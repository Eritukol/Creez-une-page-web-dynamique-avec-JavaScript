// Fonction pour regrouper tous les éléments du formulaire de connexion
function getLoginElements() {
    return {
        form: document.getElementById("form"),               // Le formulaire global
        emailInput: document.getElementById("email"),        // Champ e-mail
        passwordInput: document.getElementById("password"),  // Champ mot de passe
        errorMessage: document.getElementById("formError")   // Élément pour afficher les messages d'erreur
    };
}

// On déstructure l'objet retourné pour accéder directement aux éléments
const { form, emailInput, passwordInput, errorMessage } = getLoginElements();

// Affiche un message d'erreur dans l'élément prévu à cet effet
function showError(message) {
    errorMessage.innerText = message;
    errorMessage.style.display = "block";
}

// Réinitialise et masque l'affichage d'erreur
function clearError() {
    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
}

// Écoute les modifications de l'input e-mail pour enlever l'erreur visuelle si l'utilisateur corrige
emailInput.addEventListener("input", () => {
    emailInput.classList.remove("loginError");
    clearError();
});

// Pareil pour le champ mot de passe
passwordInput.addEventListener("input", () => {
    passwordInput.classList.remove("loginError");
    clearError();
});

// Gestion de la soumission du formulaire
form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // On récupère les valeurs saisies, sans espaces inutiles
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        // On envoie une requête POST à l'API avec les identifiants
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // On indique le format envoyé
            },
            body: JSON.stringify({ email, password }) // On convertit les données JS en JSON
        });

        if (response.ok) {
            // Connexion réussie
            const data = await response.json();               // On récupère le token
            sessionStorage.setItem("token", data.token);      // On le stocke pour les futures requêtes admin
            window.location.href = "index.html";              // Redirection vers la page d'accueil
        } 
        else if (response.status === 401 || response.status === 404) {
            // Erreur d'identifiants
            emailInput.classList.add("loginError");
            passwordInput.classList.add("loginError");
            showError("Combinaison e-mail / mot de passe incorrect");
        } 
        else {
            // Autre erreur serveur
            showError("Une erreur est survenue. Veuillez réessayer plus tard.");
        }

    } catch (error) {
        // Erreur réseau ou serveur hors-ligne
        console.error("Erreur de connexion :", error);
        showError("Impossible de se connecter au serveur.");
    }
});
