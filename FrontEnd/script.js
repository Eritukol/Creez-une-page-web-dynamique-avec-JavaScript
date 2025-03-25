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


// On utilise fetch pour récupérer les données depuis une URL (dans ce cas, l'API qui se trouve à localhost:5678)
fetch("http://localhost:5678/api/works")
    .then(response => response.json())  // La réponse du serveur est d'abord récupérée sous forme JSON
    .then(data => {  // Une fois la réponse convertie en JSON, on passe les données à cette fonction
        console.log("Données récupérées :", data); // On affiche les données dans la console pour s'assurer qu'elles sont bien récupérées
        afficherGalerie(data); // On appelle une fonction pour afficher ces données dans la galerie de l'interface
    })
    .catch(error => console.error("Erreur fetch :", error));  // En cas d'erreur, on l'affiche dans la console

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
        const title = document.createElement("h2");
        title.innerText = work.title;  // On met le titre du travail dans l'élément h2

        // On ajoute l'image et le titre à l'article (ce sont les éléments visibles)
        article.appendChild(image);  // On ajoute l'image à l'article
        article.appendChild(title);  // On ajoute le titre à l'article

        // On ajoute l'article à la galerie (cela l'affiche sur la page web)
        gallery.appendChild(article);
    });
}
