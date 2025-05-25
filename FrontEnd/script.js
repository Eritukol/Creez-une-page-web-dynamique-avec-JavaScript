const adminToken = sessionStorage.getItem("token");

// ==============================
// INITIALISATION DE L'APPLICATION
// ==============================

initApp();

function initApp() {
  getWorks()
    .then((works) => {
      renderGallery(works); // Affiche tous les travaux dans la galerie
      createFilters(works); // Crée les boutons de filtre dynamiquement
      Admin(); // Appel la fonction admin
    })
    .catch((error) => console.error("Erreur lors du chargement :", error));
}

// ==============================
// FONCTION : RÉCUPÉRER LES TRAVAUX DE L'API
// ==============================

async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    console.log("Travaux récupérés :", data);

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
    return []; // On retourne un tableau vide en cas d'échec pour éviter les bugs plus loin
  }
}

// ==============================
// FONCTION : AFFICHER LES TRAVAUX DANS LA GALERIE
// ==============================

function renderGallery(works) {
  const galleryContainer = document.querySelector(".gallery");

  if (!galleryContainer) {
    console.error("Erreur : élément .gallery introuvable.");
    return;
  }

  galleryContainer.innerHTML = ""; // On vide la galerie avant réinjection

  works.forEach((work) => {
    const figure = createWorkFigure(work);
    galleryContainer.appendChild(figure);
  });
}

// Fonction utilitaire pour créer un élément <figure> à partir d'un work
function createWorkFigure(work) {
  const figure = document.createElement("figure");

  const image = document.createElement("img");
  image.src = work.imageUrl;
  image.alt = work.title;

  const caption = document.createElement("figcaption");
  caption.textContent = work.title;

  figure.appendChild(image);
  figure.appendChild(caption);

  return figure;
}

// ==============================
// FONCTION : CRÉER LES BOUTONS DE FILTRE
// ==============================

function createFilters(works) {
  const filtersContainer = document.querySelector(".filters");

  if (!filtersContainer) {
    console.error("Erreur : élément .filters introuvable.");
    return;
  }

  filtersContainer.innerHTML = ""; // Nettoyage si on recharge

  const categories = getUniqueCategories(works);

  // --- Création du bouton "Tous" ---
  const allButton = createFilterButton("Tous", () => {
    renderGallery(works); // Réaffiche tous les travaux
    setActiveFilter(allButton); // Active le bouton cliqué
  });
  allButton.classList.add("active"); // Par défaut actif au démarrage
  filtersContainer.appendChild(allButton);

  // --- Création des autres boutons catégories ---
  categories.forEach((category) => {
    const button = createFilterButton(category, () => {
      const filtered = works.filter((work) => work.category.name === category);
      renderGallery(filtered); // Affiche uniquement la catégorie filtrée
      setActiveFilter(button); // Active le bouton cliqué
    });
    filtersContainer.appendChild(button);
  });
}
 
// Fonction utilitaire pour créer un bouton de filtre
function createFilterButton(label, onClick) {
  const button = document.createElement("button");
  button.classList.add("filters-button");
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

// Fonction pour extraire les noms de catégories uniques
function getUniqueCategories(works) {
  return [...new Set(works.map((work) => work.category.name))];
}

// Fonction pour gérer l'état "actif" d'un bouton de filtre
function setActiveFilter(activeButton) {
  const allButtons = document.querySelectorAll(".filters-button");
  allButtons.forEach((button) => button.classList.remove("active"));
  activeButton.classList.add("active");
}

// ==============================
// FONCTION : ADMIN
// ==============================

function Admin() {
  if (adminToken) {
    const connect = document.getElementById("login");
    console.log("token trouvé :", adminToken);
    connect.innerHTML = "<a href='#'>logout</a>";

    connect.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("token");
      window.location.href = "index.html";
    });

    adminDisplay();

    navigateModal();
    
  }
}

function adminDisplay() {
  // Création de la bannière noire
  const banner = document.getElementById("bannerEdit");

  banner.classList.add("blackBanner");
  banner.innerHTML =
    '<i class="fa-regular fa-pen-to-square"></i>' + "Mode édition";

  // On masque les filters
  const filters = document.querySelector(".filters");
  filters.style.display = "none";

  // Modification de la margin sous le h2 'Mes Projets'
  const portfolioTitle = document.querySelector(".portfolioTitle");
  portfolioTitle.style.marginBottom = "90px";

  // Ajout du bouton modifier
  const boutonEdit = document.createElement("a");
  boutonEdit.innerHTML =
    '<i class="fa-regular fa-pen-to-square"></i>' + "modifier";
  boutonEdit.href = "#modal1";
  boutonEdit.classList.add("editBouton", "js-modal");
  portfolioTitle.appendChild(boutonEdit);
  boutonEdit.addEventListener("click", openModal);
}

///////// Modal
const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.classList.remove("hidden");
  target.setAttribute("aria-hidden", "false");

  getWorks().then((works) => {
    renderModalGallery(works);
  });
};



// Réinitialise l'aperçu de l'image
function resetPreview() {
  const previewImage = document.getElementById("preview");
  const uploadContainer = document.getElementById("upload");

  if (previewImage) {
    previewImage.src = "";
    previewImage.style.display = "none";
  }

  if (uploadContainer) {
    uploadContainer.style.display = "flex"; // ou "block" selon ton CSS
  }

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

// Réinitialise le formulaire et ses éléments associés
function resetFormComplet() {
  const form = document.getElementById("addWorkForm");
  if (form) form.reset();

  resetPreview();

  const submitButton = document.querySelector(".submit-button");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add("disabled");
  }
}

// Ferme la modale et réinitialise son état
const closeModal = function () {
  const modal = document.querySelector(".modal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");

  // Réinitialise formulaire et image
  resetFormComplet();

  // Affiche galerie, cache formulaire et flèche
  const modalContent1 = document.querySelector(".modalContent1");
  const modalContent2 = document.querySelector(".modalContent2");
  const arrowLeft = document.querySelector(".arrowLeft");

  if (modalContent1 && modalContent2 && arrowLeft) {
    modalContent1.classList.remove("hidden");
    modalContent2.classList.add("hidden");
    arrowLeft.classList.add("hidden");
  }
};

// Écouteurs pour fermer la modale
document.querySelectorAll(".modal-close").forEach((btn) => {
  const modal = document.querySelector(".modal");

  btn.addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    const modalWrapper = modal.querySelector(".modal-wrapper");
    if (!modalWrapper.contains(e.target)) {
      closeModal();
    }
  });
});



document.querySelectorAll(".modal-close").forEach((btn) => {
  const modal = document.querySelector(".modal");
  btn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    const modalWrapper = modal.querySelector(".modal-wrapper");
    if (!modalWrapper.contains(e.target)) {
      closeModal();
    }
  });
});


function renderModalGallery(works) {
  const modalContent = document.querySelector(".modal-content");

  if (!modalContent) {
    console.error("Erreur : .modal-content introuvable");
    return;
  }

  modalContent.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.classList.add("modal-figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-btn");
    deleteIcon.setAttribute("data-id", work.id);

    deleteIcon.addEventListener("click", async () => {
      const workId = deleteIcon.getAttribute("data-id");
      const isConfirmed = confirm("Voulez vous vraiment supprimer ce projet ?");
      if (isConfirmed) {
        await deleteWorks(workId);
        const updateWorks = await getWorks();
        renderModalGallery(updateWorks); // Rafraichit la modale
        renderGallery(updateWorks); // Rafraîchir la galerie principale aussi
      }
    });

    figure.appendChild(img);
    figure.appendChild(deleteIcon);
    modalContent.appendChild(figure);
  });
}

 async function deleteWorks(workId) {
    const adminToken = sessionStorage.getItem("token")
    try {
        
            let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            if (response.ok) {
                console.log("Projet supprimé avec succès.");
               const updateWorks = await getWorks();
                renderModalGallery(updateWorks); // Rafraichit la modale
                renderGallery(updateWorks); // Rafraîchir la galerie principale aussi
            } else if (response.status === 401) {
                console.error("Non autorisé à effectuer cette action.");
            }
        

    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    };
};

function checkFormValidity() {
  const imageInput = document.getElementById("image");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const submitButton = document.querySelector(".submit-button");

  const isImageSelected = imageInput.files.length > 0;
  const isTitleFilled = titleInput.value.trim() !== "";
  const isCategorySelected = categorySelect.value !== "";

  if (isImageSelected && isTitleFilled && isCategorySelected) {
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#1D6154"; // ou ta couleur active
    submitButton.style.cursor = "pointer";
  } else {
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "#A7A7A7"; // gris désactivé
    submitButton.style.cursor = "not-allowed";
  }
}



function navigateModal() {
  const btnAddWork = document.querySelector(".btnAddWork"); // Bouton "Ajouter une photo"
  const modalContent1 = document.querySelector(".modalContent1"); // Galerie de la modale
  const modalContent2 = document.querySelector(".modalContent2"); // Formulaire d'ajout
  const arrowLeft = document.querySelector(".arrowLeft"); // Flèche retour

  // --- Quand on clique sur "Ajouter une photo"
  btnAddWork.addEventListener("click", function () {
    modalContent1.classList.add("hidden"); // on cache la galerie
    modalContent2.classList.remove("hidden"); // on affiche le formulaire
    arrowLeft.classList.remove("hidden"); // on affiche la flèche de retour

    createCategoryOption(); // Remplit la liste déroulante au moment où on ouvre le formulaire
    setupFormSubmission();

  });

    const imageInput = document.getElementById("image");
    const previewImage = document.getElementById("preview");
    const previewContainer = document.getElementById("previewContainer");

    imageInput.addEventListener("change", function () {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
          previewImage.setAttribute("src", reader.result);
          previewImage.style.display = "block";

          // Cache les autres éléments
          document.getElementById("upload").style.display="none";
          previewContainer.querySelector("i").style.display = "none";
          previewContainer.querySelector("label").style.display = "none";
          previewContainer.querySelector("p").style.display = "none";
        
        
        });
        reader.readAsDataURL(file);
      };
     checkFormValidity(); // check apres le changement de fichier
     document.getElementById("title").addEventListener("input", checkFormValidity);
     document.getElementById("category").addEventListener("change", checkFormValidity);
    
    });
    // --- Quand on clique sur la flèche retour
    arrowLeft.addEventListener("click", function () {
    modalContent2.classList.add("hidden");
    modalContent1.classList.remove("hidden");
    arrowLeft.classList.add("hidden");
  });
}

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur API catégories :", error);
    return [];
  }
}

// Fonction pour créer les options pour la selection de catégorie d'ajout photo
async function createCategoryOption() {
  const dataCategories = await getCategories();
  const categorie = document.getElementById("category");

  categorie.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "-- choisissez une catégorie --";
  defaultOption.value = "";
  categorie.appendChild(defaultOption);

  dataCategories.forEach((category) => {
    if (category && category.name && category.id) {
      const option = document.createElement("option");
      option.innerText = category.name;
      option.value = category.id;
      categorie.appendChild(option);
    }
  });
}


function setupFormSubmission() {
  const form = document.getElementById("addWorkForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const imageInput = document.getElementById("image");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updateWorks = await getWorks();
        renderGallery(updateWorks);
        renderModalGallery(updateWorks);
        closeModal(); 
      } else {
        const errorData = await response.json();
        console.error("Erreur à l'envoi :", errorData.message || response.statusText);
        alert("Echec de l'ajout. Veuillez réessayer.");
      }

    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Une erreur est survenue lors de l'envoi.");
    }
  });
}

