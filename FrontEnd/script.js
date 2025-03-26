const gallery = document.querySelector(".gallery"); //Sélectionne l'élément HTML ayant la classe .gallery(ou il y a images et textes des travaux)
const menu = document.getElementById("category-menu");//Sélectionne l'élément HTML ou il y aura btns filtres
var works;// variable works qui contiendra la liste des projets récupérés depuis l'AP

main();//fonction principale au chargement du script

function main() {//Définit la fonction principale main
    fetchAndDisplayWorks();//Appelle fetchAndDisplayWorks() pour récupérer et afficher les projets
    manageCategories();//Appelle manageCategories() pour gérer les catégories et ajouter les filtres
}




function manageCategories() {//la fonction qui gère les categories des filtres
    fetch("http://localhost:5678/api/works")//envoie une requête à l'API pour récupérer les projets
        .then(response => response.json())//convertit la réponse en JSON
        .then(works => {
            const categories = getUniqueCategories(works);
            generateCategoryMenu(categories);
            setupCategoryFilters(works);
            filterWorksByCategory("all", works);
        })
        .catch(error => console.error("Erreur lors de la récupération des projets :", error));
}




// Fonction pour récupérer et afficher les travaux
async function fetchAndDisplayWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) throw new Error("Erreur lors de la récupération des projets");

         works = await response.json();
        gallery.innerHTML = "";

        works.forEach(work => {
            const projectElement = document.createElement("figure");
            projectElement.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
            `;
            gallery.appendChild(projectElement);
        });

        console.log("Projets affichés avec succès !");
    } catch (error) {
        console.error("Erreur :", error);
    }
}



// ✅ Ajout de la fonction manquante
function getUniqueCategories(works) {
    const categories = new Set();
    works.forEach(work => {
        if (work.category && work.category.name) {
            categories.add(work.category.name);
        }
    });
    return Array.from(categories);
}

function generateCategoryMenu(categories) {
    

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filterButton")
    allButton.classList.add("filterButtonActive")
    allButton.dataset.category = "all";
    menu.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.classList.add("filterButton")
        button.classList.add("filterButtonActive")
        button.dataset.category = category;
        menu.appendChild(button);
    });
}

async function filterWorksByCategory(category, works) {
    const gallery = document.querySelector(".gallery"); // Correction de la sélection
    gallery.innerHTML = "";

    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error("Erreur lors de la récupération des projets");

     works = await response.json();

    let filteredWorks = category === "all" ? works : works.filter(work => work.category.name === category);

    filteredWorks.forEach(work => {
        const projectElement = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const caption = document.createElement("figcaption");
        caption.textContent = work.title;

        projectElement.appendChild(img);
        projectElement.appendChild(caption);
        gallery.appendChild(projectElement);

    });

}




function setupCategoryFilters(works) {
    const buttons = document.querySelectorAll("#category-menu button");

    // Assurer que tous les boutons sont en mode "normal" au chargement
    buttons.forEach(button => button.classList.remove("filterButtonActive"));

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Retirer l'état actif de tous les boutons
            buttons.forEach(btn => btn.classList.remove("filterButtonActive"));

            // Activer le bouton cliqué
            button.classList.add("filterButtonActive");

            // Filtrer les projets
            filterWorksByCategory(button.dataset.category, works);
        });
    });
}




