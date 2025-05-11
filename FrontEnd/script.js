
const adminToken = sessionStorage.getItem("token");



// ==============================
// INITIALISATION DE L'APPLICATION
// ==============================

initApp();

function initApp() {
    getWorks()
        .then(works => {
            renderGallery(works);      // Affiche tous les travaux dans la galerie
            createFilters(works);      // Crée les boutons de filtre dynamiquement
            Admin();                   // Appel la fonction admin
        })
        .catch(error => console.error("Erreur lors du chargement :", error));
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

    works.forEach(work => {
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
        renderGallery(works);          // Réaffiche tous les travaux
        setActiveFilter(allButton);   // Active le bouton cliqué
    });
    allButton.classList.add("active"); // Par défaut actif au démarrage
    filtersContainer.appendChild(allButton);

    // --- Création des autres boutons catégories ---
    categories.forEach(category => {
        const button = createFilterButton(category, () => {
            const filtered = works.filter(work => work.category.name === category);
            renderGallery(filtered);      // Affiche uniquement la catégorie filtrée
            setActiveFilter(button);      // Active le bouton cliqué
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
    return [...new Set(works.map(work => work.category.name))];
}

// Fonction pour gérer l'état "actif" d'un bouton de filtre
function setActiveFilter(activeButton) {
    const allButtons = document.querySelectorAll(".filters");
    allButtons.forEach(button => button.classList.remove("active"));
    activeButton.classList.add("active");
}


// ==============================
// FONCTION : ADMIN
// ==============================



function Admin() {
    if (adminToken) {
        const connect = document.getElementById('login');
        console.log("token trouvé :", adminToken);
        connect.innerHTML = "<a href='#'>logout</a>";

        connect.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("token");
            window.location.href = "index.html";
        });


        adminDisplay();
        
        // navigateModal();
        // createCategoryOption();
        // inputFiles();
        // addWorks();

    };
};

function adminDisplay() {
    // Création de la bannière noire
    const banner = document.getElementById('bannerEdit')

    banner.classList.add("blackBanner")
    banner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + "Mode édition";

    // On masque les filters
    const filters = document.querySelector(".filters");
    filters.style.display = "none";

    // Modification de la margin sous le h2 'Mes Projets' 
    const portfolioTitle = document.querySelector(".portfolioTitle");
    portfolioTitle.style.marginBottom = "90px";

    // Ajout du bouton modifier
    const boutonEdit = document.createElement("a");
    boutonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + "modifier";
    boutonEdit.href = "#modal1";
    boutonEdit.classList.add("editBouton", "js-modal")
    portfolioTitle.appendChild(boutonEdit)
    boutonEdit.addEventListener("click", openModal);
}

///////// Modal
const openModal = function(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.classList.remove("hidden");
    target.setAttribute("aria-hidden", "false");

    getWorks().then(works => {
        renderModalGallery(works);
    });
};

const closeModal = function () {
    const modal = document.querySelector(".modal");
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    
};



document.querySelectorAll(".modal-close").forEach((btn) => {
    const modal = document.querySelector(".modal");
    btn.addEventListener("click", closeModal);
    modal.addEventListener("click", closeModal);
});


function renderModalGallery(works) {
    const modalContent = document.querySelector(".modal-content");

    if (!modalContent) {
        console.error("Erreur : .modal-content introuvable");
        return;
    }

    modalContent.innerHTML = ""; 

    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.classList.add("modal-figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash-can", "modal-delete-icon");
        deleteIcon.setAttribute("data-id", work.id);

        deleteIcon.addEventListener("click", async () => {
            const workId = deleteIcon.getAttribute("data-id");
            const isConfirmed = confirm("Voulez vous vraiment supprimer ce projet ?");
            if (isConfirmed) {
                await deleteWork(workId);
                const updateWorks = await getWorks();
                renderModalGallery(updateWorks); // Rafraichit la modale
                renderGallery(updateWorks);      // Rafraîchir la galerie principale aussi
            }
        });

        figure.appendChild(img);
        figure.appendChild(deleteIcon);
        modalContent.appendChild(figure);
    });
}


function navigateModal() {
    const buttonModal = document.querySelector(".buttonModal");
    const modalContent1 = document.querySelector(".modalContent1");
    const modalContent2 = document.querySelector(".modalContent2");
    const arrowLeft = document.querySelector(".arrowLeft");

    // Pour aller vers la fenêtre d'ajout de projet
    buttonModal.addEventListener("click", function () {
        modalContent1.style.display = "none";
        modalContent2.style.display = "flex";
        arrowLeft.style.display = "flex";
        //buttonFormCheck();
    });

    // Pour aller vers la fenêtre de la gallerie de la modale
    arrowLeft.addEventListener("click", function () {
        modalContent1.style.display = "flex";
        modalContent2.style.display = "none";
        arrowLeft.style.display = "none";
        //resetForm()
    });
};

// Fonction pour créer les options pour la selection de catégorie d'ajout photo
async function createCategoryOption() {
    const dataCategories = await getCategories();
    const categorie = document.getElementById("category");

    dataCategories.forEach((category) => {
        const option = document.createElement("option");
        option.innerText = category.name;
        option.value = category.id;
        option.classList.add("option");
        categorie.appendChild(option);
    });

};

// const gallery = document.querySelector(".gallery");
// const filters = document.querySelector(".filters");
// const  galleryModal = document.querySelector(".galleryModal");
// const adminToken = sessionStorage.getItem("token");

// async function main() {
//     displayWorks();
//     displayFilters();
//     Admin();

// }

// main();


// //fonction affichage des works

// async function displayWorks(categorieId) {
//     try {
//         const dataworks = await getWorks();
//         console.log(gallery, galleryModal);
//         console.log(dataworks);

//         gallery.innerHTML = "";
//         galleryModal.innerHTML = "";
//         // Creation des projets pour afficher la galleries
//         dataworks.forEach((works) => {
//             if (categorieId == works.category.id || categorieId == null) {
//                 createWorks(works);
//                 createWorksModal(works);
//             }
//         });
//     }   catch (error) {
//         console.log("erreur lors de l'affichage des projets");
//     };
// };

// //fonction API

// async function getWorks() {
//     try {
//         const worksReponse = await fetch("http://localhost:5678/api/works");
//         return worksReponse.json();
//     } catch (error) {
//         console.log("Erreur lors de la récupération des projets depuis l'API");
//     };
// };

// //fonction pour créer un projet dans la galerie
// function createWorks(works) {
//     const figure = document.createElement("figure");
//     const img = document.createElement("img");
//     const figcaption = document.createElement("figcaption");

//     img.src = works.imageUrl;
//     figcaption.innerText = works.title;
//     figure.setAttribute("categorieId", works.category.id);

//     figure.appendChild(img);
//     figure.appendChild(figcaption);
//     gallery.appendChild(figure);
// }


// async function getCategories() {
//     try {
//         const categoriesResponse = await fetch("http://localhost:5678/api/categories");
//         return await categoriesResponse.json();
//     } catch (error) {
//         console.log("Erreur lors de la récupération des catégories depuis l'API");
//     };
// };


// //fonction pour créer un projet dans la modale
// function createWorksModal(works) {
//     const figureModal = document.createElement("figure");
//     const imgModal = document.createElement("img");
    
//     imgModal.src = works.imageUrl;
//     figureModal.setAttribute("id", works.id);

//     const iconTrash = document.createElement("div");
//     iconTrash.classList.add("iconTrash");
//     iconTrash.innerHTML = "<i class='fa-solid fa-trash-can modalTrash'></i>";

//     figureModal.appendChild(imgModal);
//     figureModal.appendChild(iconTrash);
//     galleryModal.appendChild(figureModal);

//     //Ajout event listener sur l'icon corbeille pour supprimer projet
//     iconTrash.addEventListener("click", (e) => {
//         e.preventDefault();
//         deleteWorks(works.id);
//     });
// };

// // Boutons filters par catégories
// async function displayFilters() {

//     const dataCategories = await getCategories();
    
//     const allButton = document.createElement("button");
//     allButton.innerText = "Tous";
//     allButton.setAttribute("class", "filterButton filterButtonActive"); // Actif par défaut
//     allButton.setAttribute("buttonId", "all");
//     filters.appendChild(allButton);

//     // Créations des boutons
//     dataCategories.forEach((category) => {
//         const btnCategorie = document.createElement("button");
//         btnCategorie.innerText = category.name;
//         btnCategorie.setAttribute("class", "filterButton")
//         btnCategorie.setAttribute("buttonId", category.id);
//         filters.appendChild(btnCategorie);
//     });

//     // Ajout d'un event au clic sur chaque bouton
//     const buttons = document.querySelectorAll(".filters button");
//     buttons.forEach((button) => {
//         button.addEventListener("click", function () {
//             let categorieId = this.getAttribute("buttonId");
        
//             buttons.forEach((btn) => btn.classList.remove("filterButtonActive"));
//             this.classList.add("filterButtonActive");
        
//             // Si le bouton "Tous" est cliqué
//             if (categorieId === "all") {
//                 displayWorks(null);
//             } else {
//                 displayWorks(categorieId);
//             }
//         });
        
//     });
// };


// // Partie Admin connecté

// function Admin() {
//     if (adminToken) {
//         const connect = document.getElementById('login');

//         connect.innerHTML = "<a href='#'>logout</a>";

//         connect.addEventListener("click", (e) => {
//             e.preventDefault();
//             sessionStorage.removeItem("token");
//             window.location.href = "index.html";
//         });


//         adminDisplay();
//         navigateModal();
//         createCategoryOption();
//         inputFiles();
//         addWorks();

//     };
// };

// function adminDisplay() {
//     // Création de la bannière noire
//     const banner = document.getElementById('bannerEdit')

//     banner.classList.add("blackBanner")
//     banner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + "Mode édition";

//     // On masque les filters
//     const filters = document.querySelector(".filters");
//     filters.style.display = "none";

//     // Modification de la margin sous le h2 'Mes Projets' 
//     const portfolioTitle = document.querySelector(".portfolioTitle");
//     portfolioTitle.style.marginBottom = "90px";

//     // Ajout du bouton modifier
//     const boutonEdit = document.createElement("a");
//     boutonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + "modifier";
//     boutonEdit.href = "#modal1";
//     boutonEdit.classList.add("editBouton", "js-modal")
//     portfolioTitle.appendChild(boutonEdit)

    
// }


// //// Modal

// let modal = null;
// const focusableSelector = "button, a, input, textarea";
// let focusables = [];

// //fonction pour ouvrir la modale
// const openModal = function (e) {
//     e.preventDefault();
//     modal = document.querySelector(e.target.getAttribute("href"));
//     focusables = Array.from(modal.querySelectorAll(focusableSelector));
//     previouslyFocusedElement = document.querySelector(':focus');
//     modal.style.display = null;
//     focusables[0].focus();
//     modal.removeAttribute("aria-hidden");
//     modal.setAttribute("aria-modal", "true");
//     modal.addEventListener("click", closeModal);
//     modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
//     //modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
//     boutonEdit.addEventListener("click", openModal);
// };

// // fonction pour fermer la modale
// const closeModal = function (e) {
//     if (modal === null) return;
//     if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()

//     const modalContent1 = document.querySelector(".modalContent1");
//     const modalContent2 = document.querySelector(".modalContent2");
//     const arrowLeft = document.querySelector(".arrowLeft");

//     window.setTimeout(function () {
//         modal.style.display = "none";
//         modal = null;
//         modalContent1.style.display = "flex";
//         modalContent2.style.display = "none";
//         arrowLeft.style.display = "none";
//         // Reset formulaire 
//         resetForm();
//     }, 300);

//     modal.setAttribute("aria-hidden", "true");
//     modal.removeAttribute("aria-modal");
//     modal.removeEventListener("click", closeModal);
//     modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
//     modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

// };

// const stopPropagation = function (e) {
//     e.stopPropagation();
// };


// // Gérer le focus des éléments dans la modale
// const focusInModal = function (e) {
//     e.preventDefault();
//     let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
//     if (e.shiftKey === true) {
//         index--
//     } else {
//         index++;
//     }
//     if (index >= focusables.length) {
//         index = 0;
//     }
//     if (index < 0) {
//         index = focusables.length - 1
//     }
//     focusables[index].focus();
//     console.log(index);
// };


// document.querySelectorAll(".js-modal").forEach((a) => {
//     a.addEventListener("click", openModal);
// });

// window.addEventListener("keydown", function (e) {
//     if (e.key === "Escape" || e.key === "Esc") {
//         closeModal(e);
//     }
//     if (e.key === "Tab" && modal !== null) {
//         focusInModal(e);
//     }
// });


// // Fonction pour supprimer un projet
// async function deleteWorks(workId) {
//     const adminToken = sessionStorage.getItem("token")
//     try {
//         if (window.confirm("Êtes vous sûr de vouloir effacer ce projet?")) {
//             let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
//                 method: "DELETE",
//                 headers: {
//                     accept: "*/*",
//                     Authorization: `Bearer ${adminToken}`,
//                 },
//             });

//             if (response.ok) {
//                 console.log("Projet supprimé avec succès.");
//                 displayWorks();
//             } else if (response.status === 401) {
//                 console.error("Non autorisé à effectuer cette action.");
//             }
//         }

        
//     } catch (error) {
//         console.error("Erreur lors de la requête:", error);
//     };
// };

// // Fonction pour changer de fenêtre dans la modale
// function navigateModal() {
//     const buttonModal = document.querySelector(".buttonModal");
//     const modalContent1 = document.querySelector(".modalContent1");
//     const modalContent2 = document.querySelector(".modalContent2");
//     const arrowLeft = document.querySelector(".arrowLeft");

//     // Pour aller vers la fenêtre d'ajout de projet
//     buttonModal.addEventListener("click", function () {
//         modalContent1.style.display = "none";
//         modalContent2.style.display = "flex";
//         arrowLeft.style.display = "flex";
//         buttonFormCheck();
//     });

//     // Pour aller vers la fenêtre de la gallerie de la modale
//     arrowLeft.addEventListener("click", function () {
//         modalContent1.style.display = "flex";
//         modalContent2.style.display = "none";
//         arrowLeft.style.display = "none";
//         resetForm()
//     });
// };







