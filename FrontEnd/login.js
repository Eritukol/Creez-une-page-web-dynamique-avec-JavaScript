

function getLoginElements() {
    // selectionne les éléments du dom
    return  {
        form: document.getElementById("form"),
        emailInput: document.getElementById("email"),
        passwordInput: document.getElementById("password"),
        errorMessage: document.getElementById("formError")

    };
}

const { form, emailInput, passwordInput, errorMessage } = getLoginElements();

//Gestion d'erreur formulaire

function showError(message) {
    errorMessage.innerText = message;
    errorMessage.style.display = "block";
}

function clearError() {
    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
}

emailInput.addEventListener("input", () => {
    emailInput.classList.remove("loginError");
    clearError();
});

passwordInput.addEventListener("input", () => {
    passwordInput.classList.remove("loginError");
    clearError();
});


form.addEventListener("submit", async function (event) {
    event.preventDefault(); //empeche le rechargement de la page

    // on récupère les valeurs entrée dans les champs email et mdp .trim() enlève les espaces au début et 
    // à la fin
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        const response =  await fetch("http://localhost:5678/api/users/login", {
            method: "POST", // envoie des données
            headers: { //on précise qu'on envoie du JSON
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }) // on convertit les données JS en format JSON
        });


        
        if (response.ok) {  // si reponse ok on connecte sinon 
            // Ici, connexion réussie
            const data = await response.json(); // récupère le token
            sessionStorage.setItem("token", data.token); // stocke le token dans le sessionStorage
            window.location.href = "index.html"; // redirige vers la page d'accueil

        } else if (response.status === 401) {
            passwordInput.classList.add("loginError");
            showError("Combinaison e-mail / mot de passe incorrect");
        } else if (response.status === 404) {
            emailInput.classList.add("loginError");
            showError("Utilisateur non trouvé.");
        } else {
            showError("Une erreur est survenue. Veuillez réessayer plus tard.");
        }


    } catch (error) {
        console.error("Erreur de connexion :", error);
        showError("Impossible de se connecter au serveur.");
    }
});






// const form = document.getElementById("formLogin");
// const errorMessage = document.getElementById("formError")
// const emailInput = document.getElementById("email");
// const passwordInput = document.getElementById("password");

// // Fonctions pour gérer l'affichage des erreurs
// passwordInput.addEventListener('input', function () { // on enlève les alerte d'erreur lors d'un input password
//   emailInput.classList.remove("loginError")
//   passwordInput.classList.remove("loginError")
//   clearErrorMessage();
// });

// emailInput.addEventListener('input', function () { // on enlève les alerte d'erreur lors d'un input email
//   emailInput.classList.remove("loginError")
//   passwordInput.classList.remove("loginError")
//   clearErrorMessage();
// });

// function clearErrorMessage() { // on efface le message d'erreur 
//   errorMessage.innerHTML = ""
// }

// function setErrorMessage(Error) { // on affiche un message d'erreur en fonction du type d'erreur
//   errorMessage.innerText = Error;
// }

// // Ajout d'un event sur la soumission du formulaire
// form.addEventListener('submit', async (e) => {
//   e.preventDefault(); // Empêche le rechargement de la page

//   // Récupération des valeurs des champs email et mot de passe du formulaire
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();

//   // Envoi à l'API pour authentification
//   try {
//     let response = await fetch('http://localhost:5678/api/users/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });
    
//     if (response.ok) { // identifiant valide
//       const data = await response.json();
//       sessionStorage.setItem("token", data.token);  // on enregistre le token pour cette session
//       window.location.href = "index.html"; // on retourne sur la page index 
//     } else if (response.status === 401) { // Erreur mauvais mot de passe
//       passwordInput.classList.add("loginError");
//       clearErrorMessage();
//       setErrorMessage('Mot de passe incorrect');
//     } else if (response.status === 404) { // Erreur mauvais utilisateur
//       emailInput.classList.add("loginError");
//       clearErrorMessage();
//       setErrorMessage('Utilisateur non trouvé');
//     } else { // Erreur inattendue
//       setErrorMessage('Une erreur inattendue s\'est produite, veuillez réessayer plus tard')
//     }
//   } catch (error) {
//     setErrorMessage('Une erreur inattendue s\'est produite, veuillez réessayer plus tard')
//   };
// });