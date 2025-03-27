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


async function getWorks() {
    try {
        // 🟢 1. On envoie une requête GET à l'API pour récupérer les travaux
        const response = await fetch("http://localhost:5678/api/works");

        // 🟢 2. On vérifie que la réponse est OK (statut 200)
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // 🟢 3. On transforme la réponse en JSON (un tableau d'objets "work")
        const data = await response.json();

        // ✅ 4. On affiche dans la console les données récupérées
        console.log("Données récupérées :", data);

        // ✅ 5. On appelle la fonction qui affiche les travaux dans la galerie
        afficherGalerie(data);

    } catch (error) {
        // 🔴 Si une erreur survient (problème réseau, serveur éteint, etc.)
        console.error("Erreur lors de la récupération :", error);
    }
}

// On exécute la fonction
getWorks();


// Fonction qui affiche les travaux dans la galerie
function afficherGalerie(works) {
    // Sélectionne l'élément avec la classe "gallery" (c'est là qu'on va ajouter les travaux)
    const gallery = document.querySelector(".gallery");

    // Vérifie si l'élément "gallery" existe dans le DOM
    if (!gallery) {  // Si gallery est null (n'existe pas), on affiche une erreur et on arrête la fonction
        console.error("Erreur : L'élément .gallery n'existe pas dans le DOM !");
        return;  // On arrête la fonction ici si l'élément n'existe pas
    }

    // Avant d'ajouter de nouveaux travaux à la galerie, on vide d'abord le contenu actuel pour éviter l'accumulation
    gallery.innerHTML = "";  // On vide l'élément "gallery" (cela efface tous les anciens travaux, si présents)

    // La méthode forEach permet de parcourir tous les travaux (works)
    works.forEach(work => {
        // Pour chaque work, on crée un élément "article" pour l'afficher dans la galerie
        const article = document.createElement("article");

        // On crée un élément "img" pour afficher l'image du travail
        const image = document.createElement("img");
        image.src = work.imageUrl;  // On définit la source de l'image (work.imageUrl contient l'URL de l'image)
        image.alt = work.title;  // On définit l'attribut alt pour l'image avec le titre du travail

        // On crée un élément "h2" pour afficher le titre du travail
        const title = document.createElement("h3");
        title.innerText = work.title;  // On met le titre du travail dans l'élément h3

        // On ajoute l'image et le titre à l'article (ce sont les éléments visibles)
        article.appendChild(image);  // On ajoute l'image à l'article
        article.appendChild(title);  // On ajoute le titre à l'article

        // On ajoute l'article à la galerie (cela l'affiche sur la page web)
        gallery.appendChild(article);
    });
}

