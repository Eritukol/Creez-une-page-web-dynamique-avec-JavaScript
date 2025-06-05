const adminToken = sessionStorage.getItem("token");

// ==============================
// INITIALISATION DE L'APPLICATION
// ==============================

// Point d'entrée principal de l'application
initApp();

// Fonction d'initialisation appelée au chargement de la page
function initApp() {
  getWorks()
    .then((works) => {
      renderGallery(works);     // Injecte tous les travaux dans la galerie principale
      createFilters(works);     // Génère dynamiquement les boutons de filtres à partir des catégories présentes
      Admin();                  // Active l'interface administrateur si l'utilisateur est connecté
    })
    .catch((error) => console.error("Erreur lors du chargement :", error)); // Sécurité en cas d'erreur API
}


// ==============================
// FONCTION : RÉCUPÉRER LES TRAVAUX DE L'API
// ==============================

// Fonction asynchrone pour récupérer la liste des travaux depuis l’API
async function getWorks() {
  try {
    // Requête GET vers l'API
    const response = await fetch("http://localhost:5678/api/works");

    // Si la réponse n'est pas "ok" (statut HTTP 200), on lève une erreur personnalisée
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Conversion de la réponse en JSON
    const data = await response.json();
    console.log("Travaux récupérés :", data); // Pour déboguer et vérifier les données reçues

    return data; // On retourne les données à la fonction appelante
  } catch (error) {
    // En cas d’erreur réseau ou autre, on affiche un message dans la console
    console.error("Erreur lors de la récupération des travaux :", error);
    return []; // On retourne un tableau vide pour éviter que l’application ne plante
  }
}


// ==============================
// FONCTION : AFFICHER LES TRAVAUX DANS LA GALERIE
// ==============================

// Fonction qui affiche dynamiquement tous les projets dans la galerie principale
function renderGallery(works) {
  const galleryContainer = document.querySelector(".gallery"); // Sélection de la galerie dans le DOM

  if (!galleryContainer) {
    console.error("Erreur : élément .gallery introuvable.");
    return; // Arrêt si l'élément n'existe pas
  }

  galleryContainer.innerHTML = ""; // On vide la galerie avant de la réinitialiser

  // On parcourt tous les projets récupérés depuis l'API
  works.forEach((work) => {
    const figure = createWorkFigure(work); // On crée une balise <figure> pour chaque projet
    galleryContainer.appendChild(figure);  // On l’ajoute à la galerie
  });
}


// Fonction utilitaire pour créer un élément <figure> complet à partir d'un objet "work"
function createWorkFigure(work) {
  const figure = document.createElement("figure"); // Création de la balise figure

  const image = document.createElement("img"); // Création de l'image
  image.src = work.imageUrl; // Lien vers l'image du projet
  image.alt = work.title;    // Texte alternatif pour l'accessibilité

  const caption = document.createElement("figcaption"); // Création du titre en dessous de l'image
  caption.textContent = work.title; // Le titre du projet

  // Ajout des éléments enfants dans la balise figure
  figure.appendChild(image);
  figure.appendChild(caption);

  return figure; // On retourne l'élément <figure> prêt à être inséré dans le DOM
}


// ==============================
// FONCTION : CRÉER LES BOUTONS DE FILTRE
// ==============================

// Fonction pour générer dynamiquement les boutons de filtres à partir des travaux
function createFilters(works) {
  // Sélectionne le conteneur des filtres
  const filtersContainer = document.querySelector(".filters");

  // Sécurité : vérifie si l'élément existe
  if (!filtersContainer) {
    console.error("Erreur : élément .filters introuvable.");
    return;
  }

  // Vide le conteneur pour éviter les doublons en cas de réinitialisation
  filtersContainer.innerHTML = "";

  // Extrait les catégories uniques depuis les travaux
  const categories = getUniqueCategories(works);

  // --- Création du bouton "Tous" ---
  const allButton = createFilterButton("Tous", () => {
    renderGallery(works); // Affiche tous les projets
    setActiveFilter(allButton); // Active visuellement ce bouton
  });
  allButton.classList.add("active"); // Le bouton "Tous" est actif par défaut
  filtersContainer.appendChild(allButton);

  // --- Création des boutons pour chaque catégorie ---
  categories.forEach((category) => {
    const button = createFilterButton(category, () => {
      // Filtre les projets selon la catégorie cliquée
      const filtered = works.filter((work) => work.category.name === category);
      renderGallery(filtered); // Affiche uniquement les projets filtrés
      setActiveFilter(button); // Met à jour l'état actif du bouton
    });
    filtersContainer.appendChild(button);
  });
}

 
// Fonction utilitaire pour créer un bouton de filtre
function createFilterButton(label, onClick) {
  // Crée dynamiquement un élément <button>
  const button = document.createElement("button");

  // Ajoute une classe CSS pour le style
  button.classList.add("filters-button");

  // Définit le texte du bouton (nom de la catégorie ou "Tous")
  button.textContent = label;

  // Ajoute un gestionnaire d'événement au clic
  button.addEventListener("click", onClick);

  // Retourne le bouton pour qu'il soit ajouté dans le DOM
  return button;
}


// Fonction pour extraire les noms de catégories uniques
function getUniqueCategories(works) {
  // Utilise map() pour extraire les noms de toutes les catégories depuis les projets
  // Utilise Set pour éliminer les doublons
  // Utilise l'opérateur spread (...) pour convertir le Set en tableau
  return [...new Set(works.map((work) => work.category.name))];
}


// Fonction pour gérer l'état "actif" d'un bouton de filtre
function setActiveFilter(activeButton) {
  // Sélectionne tous les boutons de filtre
  const allButtons = document.querySelectorAll(".filters-button");

  // Supprime la classe "active" de tous les boutons
  allButtons.forEach((button) => button.classList.remove("active"));

  // Ajoute la classe "active" uniquement au bouton cliqué
  activeButton.classList.add("active");
}


// ==============================
// FONCTION : ADMIN
// ==============================

function Admin() {
  // Vérifie si un token d'admin est présent (utilisateur connecté)
  if (adminToken) {
    const connect = document.getElementById("login");

    console.log("token trouvé :", adminToken);

    // Modifie le lien de connexion en lien de déconnexion ("logout")
    connect.innerHTML = "<a href='#'>logout</a>";

    // Ajoute un écouteur pour gérer la déconnexion au clic
    connect.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("token"); // Supprime le token en sessionStorage
      window.location.href = "index.html"; // Redirige vers la page d'accueil
    });

    // Affiche les éléments spécifiques au mode admin
    adminDisplay();

    // Initialise la navigation de la modale (boutons, formulaires, etc.)
    navigateModal();
  }
}


function adminDisplay() {
  // --- Création et affichage de la bannière noire en haut de page ---
  const banner = document.getElementById("bannerEdit");
  banner.classList.add("blackBanner"); // Ajoute la classe pour le style
  banner.innerHTML =
    '<i class="fa-regular fa-pen-to-square"></i>' + "Mode édition"; // Icône + texte

  // --- Masquage des filtres de catégorie, inutile en mode admin ---
  const filters = document.querySelector(".filters");
  filters.style.display = "none";

  // --- Ajustement de la mise en page (espacement sous le titre) ---
  const portfolioTitle = document.querySelector(".portfolioTitle");
  portfolioTitle.style.marginBottom = "90px";

  // --- Ajout dynamique du bouton "modifier" ---
  const boutonEdit = document.createElement("a");
  boutonEdit.innerHTML =
    '<i class="fa-regular fa-pen-to-square"></i>' + "modifier"; // Icône + texte
  boutonEdit.href = "#modal1"; // Ancre vers la modale
  boutonEdit.classList.add("editBouton", "js-modal");
  
  // Ajoute le bouton juste sous le titre "Mes projets"
  portfolioTitle.appendChild(boutonEdit);

  // Écouteur pour ouvrir la modale au clic sur le bouton "modifier"
  boutonEdit.addEventListener("click", openModal);
}




///////// Modal
// Fonction qui ouvre la modale de gestion des travaux
const openModal = function (e) {
  e.preventDefault(); // Empêche le comportement par défaut du lien (navigation)

  // Récupère l'élément ciblé par le lien (grâce à l'attribut href, ex : "#modal")
  const target = document.querySelector(e.target.getAttribute("href"));

  // Affiche la modale en supprimant la classe "hidden" et en mettant à jour l'accessibilité
  target.classList.remove("hidden");
  target.setAttribute("aria-hidden", "false");

  // Récupère les projets existants depuis l'API et les affiche dans la galerie de la modale
  getWorks().then((works) => {
    renderModalGallery(works);
  });
};




// Réinitialise l'aperçu de l'image après fermeture ou réinitialisation du formulaire
function resetPreview() {
  const previewImage = document.getElementById("preview"); // l'image de prévisualisation
  const uploadContainer = document.getElementById("upload"); // conteneur du champ image

  // Si une image a été prévisualisée, on la cache et on vide sa source
  if (previewImage) {
    previewImage.src = "";
    previewImage.style.display = "none";
  }

  // On réaffiche le conteneur de téléchargement (si masqué précédemment)
  if (uploadContainer) {
    uploadContainer.style.display = "flex"; // selon le style utilisé (peut être "block")
  }

  // On réaffiche les éléments qui composent l'interface d’upload : icône, label et texte
  const previewContainer = document.getElementById("previewContainer");
  if (previewContainer) {
    const icon = previewContainer.querySelector("i");
    const label = previewContainer.querySelector("label");
    const infoText = previewContainer.querySelector("p");

    if (icon) icon.style.display = "block";
    if (label) label.style.display = "block";
    if (infoText) infoText.style.display = "block";
  }
}




// Réinitialise le formulaire d'ajout et ses éléments associés
function resetFormComplet() {
  // Récupère le formulaire d'ajout via son ID
  const form = document.getElementById("addWorkForm");

  // Si le formulaire existe, on le réinitialise (efface les champs image, titre et catégorie)
  if (form) form.reset();

  // Réinitialise la prévisualisation de l'image ajoutée (fonction définie ailleurs)
  resetPreview();

  // Récupère le bouton de soumission
  const submitButton = document.querySelector(".submit-button");

  // Si le bouton existe, on le désactive et on lui ajoute une classe "disabled" pour le style
  if (submitButton) {
    submitButton.disabled = true;              // désactivation technique
    submitButton.classList.add("disabled");    // désactivation visuelle (CSS)
  }
}



// Fonction pour fermer la modale et remettre son état par défaut
const closeModal = function () {
  // Sélectionne l'élément principal de la modale
  const modal = document.querySelector(".modal");

  // Cache la modale avec la classe "hidden"
  modal.classList.add("hidden");

  // Met à jour l’attribut ARIA pour l’accessibilité
  modal.setAttribute("aria-hidden", "true");

  // Réinitialise le formulaire et la prévisualisation d'image (fonction personnalisée)
  resetFormComplet();

  // Récupère les deux vues internes de la modale et la flèche de retour
  const modalContent1 = document.querySelector(".modalContent1"); // galerie des projets
  const modalContent2 = document.querySelector(".modalContent2"); // formulaire d'ajout
  const arrowLeft = document.querySelector(".arrowLeft"); // flèche retour

  // Si les éléments existent, on rétablit l'état initial de la modale
  if (modalContent1 && modalContent2 && arrowLeft) {
    modalContent1.classList.remove("hidden"); // Affiche la galerie
    modalContent2.classList.add("hidden");    // Cache le formulaire
    arrowLeft.classList.add("hidden");        // Cache la flèche
  }
};


// Sélectionne tous les boutons permettant de fermer la modale (croix, bouton "X", etc.)
document.querySelectorAll(".modal-close").forEach((btn) => {
  // Récupère l’élément principal de la modale
  const modal = document.querySelector(".modal");

  // Ajoute un écouteur de clic pour fermer la modale quand on clique sur le bouton
  btn.addEventListener("click", closeModal);

  // Ajoute un écouteur de clic sur toute la modale
  modal.addEventListener("click", function (e) {
    // Récupère l'intérieur de la modale (le contenu à ne pas fermer si on clique dedans)
    const modalWrapper = modal.querySelector(".modal-wrapper");

    // Si le clic s'est produit en dehors de .modal-wrapper, on ferme la modale
    if (!modalWrapper.contains(e.target)) {
      closeModal();
    }
  });
});




function renderModalGallery(works) {
  // Sélectionne le conteneur où afficher les projets dans la modale
  const modalContent = document.querySelector(".modal-content");

  // Vérifie si l'élément cible existe dans le DOM
  if (!modalContent) {
    console.error("Erreur : .modal-content introuvable");
    return;
  }

  // Vide la galerie actuelle avant de la reconstruire
  modalContent.innerHTML = "";

  // Parcourt chaque projet reçu en paramètre
  works.forEach((work) => {
    // Crée une balise <figure> pour chaque projet
    const figure = document.createElement("figure");
    figure.classList.add("modal-figure");

    // Crée l'image du projet
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Crée l'icône de suppression (poubelle)
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-btn");
    deleteIcon.setAttribute("data-id", work.id);

    // Ajoute un événement de suppression au clic sur l’icône
    deleteIcon.addEventListener("click", async () => {
      const workId = deleteIcon.getAttribute("data-id");

      // Boîte de confirmation avant suppression
      const isConfirmed = confirm("Voulez vous vraiment supprimer ce projet ?");
      if (isConfirmed) {
        await deleteWorks(workId); // Supprime le projet côté serveur
        const updateWorks = await getWorks(); // Recharge les projets depuis l’API
        renderModalGallery(updateWorks); // Met à jour la galerie modale
        renderGallery(updateWorks); // Met aussi à jour la galerie principale
      }
    });

    // Assemble les éléments dans la figure
    figure.appendChild(img);
    figure.appendChild(deleteIcon);

    // Ajoute la figure au contenu de la modale
    modalContent.appendChild(figure);
  });
}


async function deleteWorks(workId) {
  // On récupère le token d'administration depuis le stockage de session
  const adminToken = sessionStorage.getItem("token");

  try {
    // Requête DELETE pour supprimer un projet spécifique via l'API
    let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${adminToken}`, // Authentification via token
      },
    });

    // Si la suppression est réussie
    if (response.ok) {
      console.log("Projet supprimé avec succès.");

      // On récupère la nouvelle liste de projets mise à jour
      const updateWorks = await getWorks();

      // Rafraîchit la galerie dans la modale (admin)
      renderModalGallery(updateWorks);

      // Rafraîchit également la galerie principale
      renderGallery(updateWorks);
    
    // Si l'utilisateur n'est pas autorisé (non authentifié ou token invalide)
    } else if (response.status === 401) {
      console.error("Non autorisé à effectuer cette action.");
    }

  } catch (error) {
    // Gère toute autre erreur (réseau, serveur, etc.)
    console.error("Erreur lors de la requête:", error);
  }
}


function checkFormValidity() {
  // On sélectionne les champs du formulaire
  const imageInput = document.getElementById("image");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const submitButton = document.querySelector(".submit-button");

  // On vérifie si les champs sont remplis correctement
  const isImageSelected = imageInput.files.length > 0; // une image est sélectionnée
  const isTitleFilled = titleInput.value.trim() !== ""; // un titre est saisi
  const isCategorySelected = categorySelect.value !== ""; // une catégorie est choisie

  // Si tous les champs sont valides, on active le bouton
  if (isImageSelected && isTitleFilled && isCategorySelected) {
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#1D6154"; // couleur active
    submitButton.style.cursor = "pointer"; // curseur cliquable
  } else {
    // Sinon, on désactive le bouton et on change son style
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "#A7A7A7"; // couleur grise désactivée
    submitButton.style.cursor = "not-allowed"; // curseur interdit
  }
}




function navigateModal() {
  // Sélection des éléments de la modale
  const btnAddWork = document.querySelector(".btnAddWork"); // Bouton "Ajouter une photo"
  const modalContent1 = document.querySelector(".modalContent1"); // Galerie de la modale
  const modalContent2 = document.querySelector(".modalContent2"); // Formulaire d'ajout
  const arrowLeft = document.querySelector(".arrowLeft"); // Flèche retour

  // Initialise la liste déroulante des catégories et le comportement du formulaire
  createCategoryOption(); 
  setupFormSubmission();

  // --- Quand on clique sur "Ajouter une photo"
  btnAddWork.addEventListener("click", function () {
    // On cache la galerie et on affiche le formulaire ainsi que la flèche de retour
    modalContent1.classList.add("hidden");
    modalContent2.classList.remove("hidden");
    arrowLeft.classList.remove("hidden");
  });

  // Prévisualisation d'image après sélection d’un fichier
  const imageInput = document.getElementById("image");
  const previewImage = document.getElementById("preview");
  const previewContainer = document.getElementById("previewContainer");

  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];

    if (file) {
      const reader = new FileReader();

      // Quand le fichier est chargé, on l'affiche en prévisualisation
      reader.addEventListener("load", function () {
        previewImage.setAttribute("src", reader.result);
        previewImage.style.display = "block";

        // On cache les éléments d’upload (icône, label et texte)
        document.getElementById("upload").style.display = "none";
        previewContainer.querySelector("i").style.display = "none";
        previewContainer.querySelector("label").style.display = "none";
        previewContainer.querySelector("p").style.display = "none";
      });

      // On lit le fichier comme une URL base64
      reader.readAsDataURL(file);
    }

    // Vérifie la validité du formulaire après sélection d'image
    checkFormValidity();

    // Ajoute les vérifications en temps réel sur le titre et la catégorie
    document.getElementById("title").addEventListener("input", checkFormValidity);
    document.getElementById("category").addEventListener("change", checkFormValidity);
  });

  // --- Quand on clique sur la flèche retour
  arrowLeft.addEventListener("click", function () {
    // On retourne à la galerie et on cache le formulaire ainsi que la flèche
    modalContent2.classList.add("hidden");
    modalContent1.classList.remove("hidden");
    arrowLeft.classList.add("hidden");
  });
}




// Fonction asynchrone pour récupérer les catégories depuis l'API
async function getCategories() {
  try {
    // Requête GET vers le serveur local pour obtenir la liste des catégories
    const response = await fetch("http://localhost:5678/api/categories");

    // Si la réponse n’est pas OK (code autre que 200–299), on lance une erreur personnalisée
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
    }

    // On retourne les données JSON si tout s’est bien passé
    return await response.json();
  } catch (error) {
    // En cas d'erreur réseau ou de réponse incorrecte, on affiche une erreur dans la console
    console.error("Erreur API catégories :", error);

    // On retourne un tableau vide pour éviter que le reste de l’application plante
    return [];
  }
}


// Fonction pour créer dynamiquement les options du menu déroulant de sélection de catégorie
async function createCategoryOption() {
  // Appel à l'API pour récupérer la liste des catégories
  const dataCategories = await getCategories();

  // Sélection de l'élément <select> dans le formulaire
  const categorie = document.getElementById("category");

  // Réinitialisation du contenu de la liste déroulante (utile si elle est rappelée plusieurs fois)
  categorie.innerHTML = "";

  // Création et ajout d'une option par défaut invitant l'utilisateur à choisir
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "-- choisissez une catégorie --";
  defaultOption.value = "";
  categorie.appendChild(defaultOption);

  // Boucle sur les catégories reçues depuis l'API
  dataCategories.forEach((category) => {
    // Vérifie que chaque objet catégorie contient bien un nom et un identifiant
    if (category && category.name && category.id) {
      // Création d'une option pour chaque catégorie
      const option = document.createElement("option");
      option.innerText = category.name; // Nom affiché à l'utilisateur
      option.value = category.id;       // ID utilisé pour l'envoi à l'API
      categorie.appendChild(option);    // Ajout de l'option dans le <select>
    }
  });
}


// Fonction d'initialisation de la soumission du formulaire d'ajout de projet
function setupFormSubmission() {
  const form = document.getElementById("addWorkForm");

  // Ajout d'un écouteur d'événement sur la soumission du formulaire
  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupération des champs du formulaire
    const imageInput = document.getElementById("image");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");

    // Création d'un objet FormData pour envoyer les données du formulaire, y compris l'image
    const formData = new FormData();
    formData.append("image", imageInput.files[0]); // Ajout de l'image
    formData.append("title", titleInput.value);     // Ajout du titre
    formData.append("category", categorySelect.value); // Ajout de la catégorie

    try {
      // Requête POST vers l'API avec le token d'authentification
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`, // Envoi du token dans l'en-tête
        },
        body: formData, // Corps de la requête contenant les données du formulaire
      });

      if (response.ok) {
        // Si l'ajout est un succès, on met à jour la galerie principale et celle de la modale
        const updateWorks = await getWorks(); // Récupération des nouveaux projets depuis l'API
        renderGallery(updateWorks);           // Réaffichage de la galerie principale
        renderModalGallery(updateWorks);      // Réaffichage de la galerie dans la modale
        closeModal();                         // Fermeture de la modale après ajout
      } else {
        // En cas d'erreur côté serveur, on affiche un message d'erreur
        const errorData = await response.json();
        console.error("Erreur à l'envoi :", errorData.message || response.statusText);
        alert("Échec de l'ajout. Veuillez réessayer.");
      }

    } catch (error) {
      // En cas d'erreur réseau (serveur inaccessible, etc.)
      console.error("Erreur réseau :", error);
      alert("Une erreur est survenue lors de l'envoi.");
    }
  });
}

