const gallery = document.querySelector(".gallery"); //Sélectionne l'élément HTML ayant la classe .gallery(ou il y a images et textes des travaux)
const menu = document.getElementById("category-menu");//Sélectionne l'élément HTML ou il y aura btns filtres
var works;// variable works qui contiendra la liste des projets récupérés depuis l'AP

main();//fonction principale au chargement du script

function main() {//Définit la fonction principale main
    fetchAndDisplayWorks();//Appelle fetchAndDisplayWorks() pour récupérer et afficher les projets
    manageCategories();//Appelle manageCategories() pour gérer les catégories et ajouter les filtres
    admin();//Appelle la fonction admin() pour gérer l'affichage en mode admin
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
            createElement(work);
            //createElementModale();
        });

        console.log("Projets affichés avec succès !");
    } catch (error) {
        console.error("Erreur :", error);
    }
}



function createElement(work) {
    const projectElement = document.createElement("figure");

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    
    const captionElement = document.createElement("figcaption");
    captionElement.textContent = work.title;
    
    projectElement.appendChild(imageElement);
    projectElement.appendChild(captionElement);
    
    gallery.appendChild(projectElement);
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
        //button.classList.add("filterButtonActive")
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



function admin(){
    const loginLink = document.querySelector("nav a[href='login.html']");
    const editButton = document.querySelector(".edit-button"); // Bouton "Modifier"
    const filters = document.querySelector(".filters"); // Section filtres

    const token = sessionStorage.getItem("token"); // Vérifie si l'admin est connecté

    if (token) {
        
        loginLink.textContent = "Logout";// Changer "Login" en "Logout"
        loginLink.href = "#"; // Désactiver le lien vers login.html
        loginLink.addEventListener("click", (event) => {
            event.preventDefault(); // Empêche le comportement par défaut du lien
            sessionStorage.removeItem("token"); // Supprime le token
            location.reload(); // Recharge la page
        });

        // Modifier l'affichage pour l'admin
        if (filters) filters.style.display = "none"; // Supprime les filtres
        if (editButton) editButton.style.display = "block"; // Affiche "Modifier"
    }

}





/*document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.querySelector("nav a[href='login.html']");
    const editButton = document.querySelector(".edit-button"); // Bouton "Modifier"
    const filters = document.querySelector(".filters"); // Section filtres

    const token = localStorage.getItem("token"); // Vérifie si l'admin est connecté

    if (token) {
        
        loginLink.textContent = "Logout";// Changer "Login" en "Logout"
        loginLink.href = "#"; // Désactiver le lien vers login.html
        loginLink.addEventListener("click", () => {
            localStorage.removeItem("token"); // Supprime le token
            location.reload(); // Recharge la page
        });

        // Modifier l'affichage pour l'admin
        if (filters) filters.style.display = "none"; // Supprime les filtres
        if (editButton) editButton.style.display = "block"; // Affiche "Modifier"
    }
});*/


// Ajoute ce script à la fin de script.js

const photoModal = document.getElementById("photoModal");
const closeButton = document.querySelector(".close-button");
const galleryView = document.getElementById("galleryView");
const addPhotoView = document.getElementById("addPhotoView");
const galleryGrid = document.getElementById("galleryGrid");
const openAddPhoto = document.getElementById("openAddPhoto");
const backToGallery = document.getElementById("backToGallery");
const photoForm = document.getElementById("photoForm");

// Simule une base de données de photos
let photos = [
  { src: "assets/images/abajour-tahina.png", title: "Abajour Tahina", category: "Salon" },
  { src: "assets/images/appartement-paris-v.png", title: "Appartement V", category: "Cuisine" },
];

function openModal() {
  photoModal.classList.remove("hidden");
  showGallery();
}

function closeModal() {
  photoModal.classList.add("hidden");
}

function showGallery() {
  galleryView.classList.remove("hidden");
  addPhotoView.classList.add("hidden");
  renderGallery();
}

function showAddForm() {
  galleryView.classList.add("hidden");
  addPhotoView.classList.remove("hidden");
}

function renderGallery() {
  galleryGrid.innerHTML = "";
  photos.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.title;
    galleryGrid.appendChild(img);
  });
}

openAddPhoto.addEventListener("click", showAddForm);
backToGallery.addEventListener("click", showGallery);
closeButton.addEventListener("click", closeModal);

photoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("photoInput");
  const title = document.getElementById("photoTitle").value;
  const category = document.getElementById("photoCategory").value;

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      photos.push({ src: e.target.result, title, category });
      showGallery();
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
});

// Tu peux appeler openModal() pour afficher la modale (ex: bouton de test)
openModal();