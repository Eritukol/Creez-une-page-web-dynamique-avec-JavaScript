// On exécute la fonction pour récupérer les travaux dès le départ
getWorks();

// Fonction qui récupère les travaux depuis l'API
async function getWorks() {
    try {
        // On envoie la requête pour récupérer les travaux
        const response = await fetch("http://localhost:5678/api/works");

        // On vérifie que la réponse est valide
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // On transforme la réponse en JSON
        const data = await response.json();

        // On affiche les travaux dans la galerie
        afficherGalerie(data);

        // On génère les filtres en fonction des catégories
        genererFiltres(data);

    } catch (error) {
        // Si une erreur survient, on l'affiche dans la console
        console.error("Erreur lors de la récupération :", error);
    }
}

// Fonction qui affiche les travaux dans la galerie
function afficherGalerie(works) {
    const gallery = document.querySelector(".gallery");

    // Vérifie si l'élément "gallery" existe
    if (!gallery) {
        console.error("Erreur : L'élément .gallery n'existe pas dans le DOM !");
        return;
    }

    // Vide la galerie avant d'ajouter les nouveaux travaux
    gallery.innerHTML = "";

    // Affiche chaque travail dans la galerie
    works.forEach(work => {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;
        
        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Fonction qui génère les filtres en fonction des catégories
function genererFiltres(works) {
    const categories = [...new Set(works.map(work => work.category.name))];
    const filtres = document.querySelector(".filtres");

    // Crée un bouton pour chaque catégorie
    categories.forEach(categoryName => {
        const button = document.createElement("button");
        button.classList.add("btn-filtre");
        button.textContent = categoryName;
        filtres.appendChild(button);
    });

    // Ajoute les gestionnaires d'événements pour chaque bouton de filtre
    const buttons = document.querySelectorAll(".btn-filtre");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const categoryClick = button.textContent;
            // Filtrer les travaux selon la catégorie sélectionnée
            const filteredWorks = filterWorks(works, categoryClick);
            afficherGalerie(filteredWorks);
        });
    });
}

// Fonction qui filtre les travaux en fonction de la catégorie
function filterWorks(works, categoryClick) {
    return works.filter(work => work.category.name === categoryClick);
}













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