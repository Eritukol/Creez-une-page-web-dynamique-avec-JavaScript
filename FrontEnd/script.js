



// ==============================
// INITIALISATION DE L'APPLICATION
// ==============================

initApp();

function initApp() {
    getWorks()
        .then(works => {
            renderGallery(works);      // Affiche tous les travaux dans la galerie
            createFilters(works);      // Crée les boutons de filtre dynamiquement
        })
        .catch(error => console.error("Erreur lors du chargement :", error));
}



// ==============================
// FONCTION : RÉCUPÉRER LES TRAVAUX DE L'API
// ==============================

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    console.log("Travaux récupérés :", data);

    return data;
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
    const filtersContainer = document.querySelector(".filtres");

    if (!filtersContainer) {
        console.error("Erreur : élément .filtres introuvable.");
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
    button.classList.add("btn-filtre");
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
    const allButtons = document.querySelectorAll(".btn-filtre");
    allButtons.forEach(button => button.classList.remove("active"));
    activeButton.classList.add("active");
}













// getWorks();
    

// async function getWorks() {
//     try {
//         const response = await fetch("http://localhost:5678/api/works");

//         if (!response.ok) {
//             throw new Error('Erreur HTTP : ${response.status}');
//         }

//         const data = await response.json();
//         console.log("Work récupérés :", data);

//         afficherGalerie(data);
//         genererFiltres(data);

//     }   catch (error) {
//         console.error("Erreur lors de la récupération des works: ", error);
//     }
// }

// function afficherGalerie(works) {
//     const gallery = document.querySelector(".gallery");
    
//     if (!gallery) {
//         console.error("Erreur : l'élément .gallery est introuvable.");
//         return;
//     }
    
//     gallery.innerHTML = ""; // On vide la galerie

//     works.forEach(work => {
//         const figure = document.createElement("figure");
//         const image = document.createElement("img");

//         image.src = work.imageUrl;
//         image.alt = work.title;

//         const figcaption = document.createElement("figcaption");
//         figcaption.innerText = work.title;

//         figure.appendChild(image);
//         figure.appendChild(figcaption);
//         gallery.appendChild(figure);
//     });
// }

// function genererFiltres(works) {
//     const filtres = document.querySelector(".filtres");

//      // Fonction pour gérer la classe active
//      function activerBouton(clique) {
//         const boutons = document.querySelectorAll(".btn-filtre");
//         boutons.forEach(b => b.classList.remove("active"));
//         clique.classList.add("active");
//     }



//     //  Création du bouton "Tous"
//     const boutonTous = document.createElement("button");
//     boutonTous.classList.add("btn-filtre","active");
//     boutonTous.textContent = "Tous";
//     filtres.appendChild(boutonTous);

//     // Gestion du clic sur "Tous"
//     boutonTous.addEventListener("click", () => {
//         afficherGalerie(works);
//         activerBouton(boutonTous);
//     });

//     //  Création des boutons à partir des catégories
//     const categories = [...new Set(works.map(work => work.category.name))];

//     categories.forEach(categoryName => {
//         const button = document.createElement("button");
//         button.classList.add("btn-filtre");
//         button.textContent = categoryName;
//         filtres.appendChild(button);

//         //  Gestion du clic sur chaque bouton de filtre
//         button.addEventListener("click", () => {
//             const filteredWorks = works.filter(work => work.category.name === categoryName);
//             afficherGalerie(filteredWorks);
//             activerBouton(button);
//         });
//     });
// }





































// const gallery = document.querySelector('.gallery');
// const filters = document.querySelector(".filters");
// const galleryModal = document.querySelector(".galleryModal");
// const adminToken = sessionStorage.getItem("token")

// async function main() {
//     displayWorks();
//     displayFilters();
//     Admin();
// }

// main();




// // Fonction pour affichage dynamiques des éléments

// async function displayWorks(categorieId) {

//     try {
//         const dataworks = await getWorks();
//         gallery.innerHTML = "";
//         galleryModal.innerHTML = "";
//         // Création des projets pour l'affichage dans les galleries
//         dataworks.forEach((works) => {
//             if (categorieId == works.category.id || categorieId == null) {
//                 createWorks(works);
//                 createWorksModal(works);
//             }
//         });
//     } catch (error) {
//         console.log("Erreur lors de l'affichage des projets");
//     };
// };


// // Fonction d'appel API
// async function getWorks() {
//     try {
//         const worksResponse = await fetch("http://localhost:5678/api/works");
//         return worksResponse.json();
//     } catch (error) {
//         console.log("Erreur lors de la récupération des projets depuis l'API");
//     };
// };

// // Fonction pour créer un projet dans la galerie
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