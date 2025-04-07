document.addEventListener("DOMContentLoaded", () => {  // attend que DOM soit charger avant d'executer js
    const loginForm = document.getElementById("login-form"); //selectionne les éléments du DOM
    const errorMessage = document.getElementById("error-message");

    loginForm.addEventListener("submit", async (event) => {//ecoute l'utilisateur appuyer sur connexion et attend la reponse du server car f(async)
        event.preventDefault();//empêche l’envoi automatique du formulaire sinon chargement de page

        const email = document.getElementById("email").value;//récupère la valeur entrée par l’utilisateur dans les champs email et mot de passe
        const password = document.getElementById("password").value;

        const response = await fetch("http://localhost:5678/api/users/login", {//envoie une requete a l'API

            method: "POST",//'colle' les valeurs récupérée (mdp,id)
            headers: {
                "Content-Type": "application/json"//précise le type de contu :format json
            },
            body: JSON.stringify({ email, password })//transforme données en format json
        });

        const data = await response.json();//objet js (data)=reponse serveur 

        if (response.ok) {//si la reponse est ok
            sessionStorage.setItem("token", data.token); // stocke  le token dans localStorage
            window.location.href = "./index.html"; // Redirection vers admin.html
        } else {
            errorMessage.textContent = "Identifiants incorrects."; // sinon cela affiche un message d'erreur
        }
    });
});