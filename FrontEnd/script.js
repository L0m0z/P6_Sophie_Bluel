
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
        const response = await fetch("http://localhost:5678/api/works");// une requête à l’API pour récupérer les projets
        if (!response.ok) throw new Error("Erreur lors de la récupération des projets");//si rep pas bonne declnche erreur

        works = await response.json();//transforme la rep en js
        gallery.innerHTML = "";//vide galerie pour eviter dupliquer

        works.forEach(work => {//pour chaque projet appelle f(createElement)
            createElement(work); // Fonction 
        });

        console.log("Projets affichés avec succès !");
    } catch (error) {//attrape l'erreur
        console.error("Erreur :", error);
    }
}

// ======= Crée un projet (figure) =======
function createElement(work) {//reception work contenant titre, img, catégorie
    const projectElement = document.createElement("figure");//crée balise figure qui contient img et texte

    const imageElement = document.createElement("img");//image du projet
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    const captionElement = document.createElement("figcaption");//texte du projet
    captionElement.textContent = work.title;

    projectElement.appendChild(imageElement);//ajout des elemnts dans le dom
    projectElement.appendChild(captionElement);

    gallery.appendChild(projectElement);
}

// ======= Gère les catégories et les filtres =======
function manageCategories() {//la fonction qui gère les categories des filtres
    fetch("http://localhost:5678/api/works")//envoie une requête à l'API pour récupérer les projets
        .then(response => response.json())//converti rep en json
        .then(works => {
            const categories = getUniqueCategories(works);//extrait les categories uniques
            generateCategoryMenu(categories);//fonction genere les btns filtres
            setupCategoryFilters(works);//gere le clic sur filtres
            filterWorksByCategory("all", works);//affiche les projets selon categorie
        })
        .catch(error => console.error("Erreur lors de la récupération des projets :", error));
}

// ======= Extrait les catégories uniques =======
function getUniqueCategories(works) {
    const categories = new Set();//permet de ne pas avoir de doublons
    works.forEach(work => {//ajoute chaque nom de categorie dans set
        if (work.category && work.category.name) {
            categories.add(work.category.name);
        }
    });
    return Array.from(categories);//convertie le set en tableau
}

// ======= Génère les boutons de filtres =======
function generateCategoryMenu(categories) {
    const allButton = document.createElement("button");//genere btn all
    allButton.textContent = "Tous";//a l'interieur c'est ecrit tous
    allButton.classList.add("filterButton", "filterButtonActive");
    allButton.dataset.category = "all";
    menu.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");//creation des autres btn
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
        button.addEventListener("click", () => {//au clique
            buttons.forEach(btn => btn.classList.remove("filterButtonActive"));//on retire le style actif des btn
            button.classList.add("filterButtonActive");//on le met au btn cliqué
            filterWorksByCategory(button.dataset.category, works);//on appellef(filtrer les categorie)
        });
    });
}

// ======= Affiche les projets selon la catégorie =======
async function filterWorksByCategory(category, works) {
    gallery.innerHTML = "";//on vide gallery

    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error("Erreur lors de la récupération des projets");

    works = await response.json();

    const filteredWorks = category === "all"//si btn tous est selectionné
        ? works//on affiche tous les projets
        : works.filter(work => work.category.name === category);//sinon on filtre par nom des catégories

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

    if (token) {//si il y a un token
        loginLink.textContent = "Logout";//login devient logout
        loginLink.href = "#";
        loginLink.addEventListener("click", (event) => {//au clic surr logout 
            event.preventDefault();
            sessionStorage.removeItem("token");//on efface token
            location.reload();//recharge la page
        });

        if (filters) filters.style.display = "none";//on cache les btn filtres
        if (editButton) editButton.style.display = "block";//on affiche modifier
    }
}

// ======= Gestion de la modale photo =======
const photoModal = document.getElementById("photoModal");//on selectionne les elements de la modale
const closeButton = document.querySelector(".close-button");
const galleryView = document.getElementById("galleryView");
const addPhotoView = document.getElementById("addPhotoView");
const galleryGrid = document.getElementById("galleryGrid");
const openAddPhoto = document.getElementById("openAddPhoto");
const photoForm = document.getElementById("photoForm");



function openModal() {
    photoModal.classList.remove("hidden");//on efface hidden donc on affiche la modale
    showGallery();//on montre gallery
}

function closeModal() {
    photoModal.classList.add("hidden");//on remet hidden pour fermer/cacher la modale
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

function renderGallery() {//on affiche les images des projets dans la galerie modale
    galleryGrid.innerHTML = "";
    
    if (!works || works.length === 0) return;

    works.forEach(work => {
        
        const figureModal = document.createElement("figure");
        const imgModal = document.createElement("img");
        imgModal.src = work.imageUrl;

        const iconTrash = document.createElement("div");
        iconTrash.classList.add("iconTrash");
        iconTrash.innerHTML= "<i class= 'fa-solid fa-trash'></i>";

        figureModal.appendChild(imgModal);
        figureModal.appendChild(iconTrash);
        galleryGrid.appendChild(figureModal);

        iconTrash.addEventListener("click" , (e)=>{//ajout d'un event au click de corbeille 
           e.preventDefault();
           deleteWorks(work.id);
        });
        
        
    });
}

async function deleteWorks(workId) {
    const adminToken = sessionStorage.getItem("token");
    try {
        if (window.confirm("Êtes vous sûr de vouloir effacer ce projet?")) {
            let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            if (response.ok) {
                console.log("Projet supprimé avec succès.");
                fetchAndDisplayWorks();
                renderGallery();
            } else if (response.status === 401) {
                console.error("Non autorisé à effectuer cette action.");
            }
        }
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }
}

// ======= Ajout d’un projet =======
async function addWorks(file, title, categoryId) {
    const adminToken = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categoryId);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
            body: formData,
        });

        if (response.ok) {
            const newWork = await response.json();
            console.log("Projet ajouté :", newWork);
            await fetchAndDisplayWorks();
            renderGallery();
            return newWork;
        } else {
            console.error("Erreur lors de l’ajout :", response.status);
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
    }
}

// ======= Formulaire d'ajout de photo =======
photoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = document.getElementById("photoInput").files[0];
    const title = document.getElementById("photoTitle").value.trim();
    const category = document.getElementById("photoCategory").value;

    if (!file || !title || !category) return;

    const newWork = await addWorks(file, title, category);

    if (newWork) {
        photoForm.reset();
        checkFormValidity();
        showGallery();
    }
});

// ======= Remplir dynamiquement le select des catégories =======
async function populateCategorySelect() {
    const select = document.getElementById("photoCategory");
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}

// ======= Activation du bouton Valider (si tout est rempli) =======
const photoInput = document.getElementById("photoInput");
const titleInput = document.getElementById("photoTitle");
const categoryInput = document.getElementById("photoCategory");
const submitBtn = photoForm.querySelector("button[type='submit']");

function checkFormValidity() {
    const file = photoInput.files[0];
    const title = titleInput.value.trim();
    const category = categoryInput.value;

    const isValid = file && title && category;
    submitBtn.disabled = !isValid;
    submitBtn.style.backgroundColor = isValid ? "#1D6154" : "#A7A7A7";
}

photoInput.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);
categoryInput.addEventListener("change", checkFormValidity);


openAddPhoto.addEventListener("click", showAddForm);
closeButton.addEventListener("click", closeModal);



const editBtn = document.querySelector(".edit-button");
if (editBtn) {//si on clique sur modifer cela ouvre modale
    editBtn.addEventListener("click", openModal);
}

// Fermer la modale quand on clique en dehors du contenu
photoModal.addEventListener("click", (e) => {
    if (!e.target.closest(".modal-content")) {//si on clique en dehors de la modale
        closeModal();//cela ferme la modale
    }
});

const backToGallery = document.getElementById("backToGallery");//selectionne fleche retour
if (backToGallery) {
	backToGallery.addEventListener("click", showGallery);//au clic retour a la galleryview
}



document.addEventListener("DOMContentLoaded", () => {
    populateCategorySelect();
    checkFormValidity(); // initialise l'état du bouton Valider au chargement
});

// Empêche le bouton dans le label d'interférer avec l'ouverture du sélecteur de fichier
document.querySelector(".photo-upload").addEventListener("click", (e) => {
    e.preventDefault(); // empêche un comportement inattendu
    document.getElementById("photoInput").click(); // ouvre le selecteur de fichiers
});



// Active la barre uniquement si l'utilisateur est connecté en admin
const isAdmin = true; // à remplacer par ta propre logique (ex : token présent)

if (isAdmin) {
  document.body.classList.add("admin-mode");
  // La barre est déjà dans le HTML, donc rien à ajouter ici si tu la laisses statique
}

