
// ======= Initialisation & Sélections =======
const gallery = document.querySelector(".gallery"); //Sélectionne l'élément HTML ayant la classe .gallery(ou il y a images et textes des travaux)
const menu = document.getElementById("category-menu"); //Sélectionne l'élément HTML ou il y aura btns filtres
let works; // variable works qui contiendra la liste des projets récupérés depuis l'AP

main(); // Lance la fonction principale au chargement


function main() {// ======= definit Fonction principale main=======
    fetchAndDisplayWorks();//Appelle fetchAndDisplayWorks() pour récupérer et afficher les projets
    manageCategories();//Appelle manageCategories() pour gérer les catégories et ajouter les filtres
    admin();//Appelle la fonction admin() pour gérer l'affichage en mode admin
}

// ======= Récupère et affiche les projets =======
async function fetchAndDisplayWorks() {// Fonction pour récupérer et afficher les travaux
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) throw new Error("Erreur lors de la récupération des projets");

        works = await response.json();
        gallery.innerHTML = "";

        works.forEach(work => {
            createElement(work); // Fonction faite par ton prof
        });

        console.log("Projets affichés avec succès !");
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// ======= Crée un projet (figure) =======
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

// ======= Gère les catégories et les filtres =======
function manageCategories() {//la fonction qui gère les categories des filtres
    fetch("http://localhost:5678/api/works")//envoie une requête à l'API pour récupérer les projets
        .then(response => response.json())//converti rep en json
        .then(works => {
            const categories = getUniqueCategories(works);
            generateCategoryMenu(categories);
            setupCategoryFilters(works);
            filterWorksByCategory("all", works);
        })
        .catch(error => console.error("Erreur lors de la récupération des projets :", error));
}

// ======= Extrait les catégories uniques =======
function getUniqueCategories(works) {
    const categories = new Set();
    works.forEach(work => {
        if (work.category && work.category.name) {
            categories.add(work.category.name);
        }
    });
    return Array.from(categories);
}

// ======= Génère les boutons de filtres =======
function generateCategoryMenu(categories) {
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filterButton", "filterButtonActive");
    allButton.dataset.category = "all";
    menu.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.classList.add("filterButton");
        button.dataset.category = category;
        menu.appendChild(button);
    });
}

// ======= Gère le clic sur les filtres =======
function setupCategoryFilters(works) {
    const buttons = document.querySelectorAll("#category-menu button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("filterButtonActive"));
            button.classList.add("filterButtonActive");
            filterWorksByCategory(button.dataset.category, works);
        });
    });
}

// ======= Affiche les projets selon la catégorie =======
async function filterWorksByCategory(category, works) {
    gallery.innerHTML = "";

    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error("Erreur lors de la récupération des projets");

    works = await response.json();

    const filteredWorks = category === "all"
        ? works
        : works.filter(work => work.category.name === category);

    filteredWorks.forEach(work => {
        createElement(work);
    });
}

// ======= Gère le mode admin =======
function admin() {
    const loginLink = document.querySelector("nav a[href='login.html']");
    const editButton = document.querySelector(".edit-button");
    const filters = document.querySelector(".filters");
    const token = sessionStorage.getItem("token");

    console.log("admin() appelée, token =", token);

    if (token) {
        loginLink.textContent = "Logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            sessionStorage.removeItem("token");
            location.reload();
        });

        if (filters) filters.style.display = "none";
        if (editButton) editButton.style.display = "block";
    }
}

// ======= Gestion de la modale photo =======
const photoModal = document.getElementById("photoModal");
const closeButton = document.querySelector(".close-button");
const galleryView = document.getElementById("galleryView");
const addPhotoView = document.getElementById("addPhotoView");
const galleryGrid = document.getElementById("galleryGrid");
const openAddPhoto = document.getElementById("openAddPhoto");
const backToGallery = document.getElementById("backToGallery");
const photoForm = document.getElementById("photoForm");



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
    
    if (!works || works.length === 0) return;

    works.forEach(photo => {
        const img = document.createElement("img");
        img.src = photo.imageUrl;
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
        reader.onload = function (e) {
            photos.push({ src: e.target.result, title, category });
            showGallery();
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
});

const editBtn = document.querySelector(".edit-button");
if (editBtn) {
    editBtn.addEventListener("click", openModal);
}



