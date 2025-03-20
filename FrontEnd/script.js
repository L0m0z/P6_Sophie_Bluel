
async function fetchAndDisplayWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) throw new Error("Erreur lors de la récupération des projets");

        const works = await response.json();
        const gallery = document.querySelector(".gallery");
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

document.addEventListener("DOMContentLoaded", fetchAndDisplayWorks);


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
    const menu = document.getElementById("category-menu");

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.dataset.category = "all";
    menu.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.dataset.category = category;
        menu.appendChild(button);
    });
}

function filterWorksByCategory(category, works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

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
            filterWorksByCategory(button.dataset.category, works);
        });
    });
}

fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        const categories = getUniqueCategories(works);
        generateCategoryMenu(categories);
        setupCategoryFilters(works);
        filterWorksByCategory("all", works);
    })
    .catch(error => console.error("Erreur lors de la récupération des projets :", error));

  