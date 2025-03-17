// Fonction pour récupérer et afficher les travaux
async function fetchAndDisplayWorks() {
    try {
        // Appel à l'API pour récupérer les projets
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) throw new Error("Erreur lors de la récupération des projets");

        const works = await response.json(); // Convertir en JSON

        const gallery = document.querySelector(".gallery"); // Sélectionne la galerie
        gallery.innerHTML = ""; // Vide la galerie avant d'ajouter les projets

        // Boucle sur les projets pour les insérer dans la galerie
        works.forEach(work => {
            const projectElement = document.createElement("figure");
            projectElement.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
            `;
            gallery.appendChild(projectElement); // Ajoute le projet à la galerie
        });

        console.log("Projets affichés avec succès !");
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Exécuter la fonction après le chargement du DOM
document.addEventListener("DOMContentLoaded", fetchAndDisplayWorks);
