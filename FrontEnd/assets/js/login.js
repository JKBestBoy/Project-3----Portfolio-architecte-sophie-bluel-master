// Sélectionner le formulaire
document.addEventListener('DOMContentLoaded', () => {
const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
        // Prévenir le comportement par défaut du formulaire
    event.preventDefault();
        // Récupérer les valeurs des champs du formulaire
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

        // Fonction asynchrone pour envoyer les données de connexion et traiter la réponse
    async function fetchUser() {
        try {
            // Envoyer une requête POST au serveur avec les identifiants
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailInput,
                    password: passwordInput,
                })
            });
            // Si la réponse est positive, traiter le token
            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                // Stock le token dans sessionStorage
                window.sessionStorage.setItem('token', token);
                
                // Redirige l'utilisateur montrer qu'il est connecté
                window.location.href = 'index.html'
                console.log("Connexion réussie, token stocké.");
            } else {
                // Gére les erreurs d'identifiants
                throw new Error("Erreur dans l'identifiant ou le mot de passe");
            }
        } catch (error) {
            // Affiche l'erreur en console et informer l'utilisateur
            console.error("Une erreur s'est produite:", error);
            alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.");
        }
    }
    // Appele la fonction fetchUser
    fetchUser();
});
});

document.addEventListener('DOMContentLoaded', (event) => {
    const loginButton = document.getElementById('loginButton');

    // Vérifie si l'utilisateur est connecté
    const token = window.sessionStorage.getItem('token');
    if (token) {
        // Modifie le texte et la fonctionnalité pour le logout
        loginButton.textContent = 'logout';
        loginButton.addEventListener('click', function() {
            // Fonctionnalité de déconnexion
            window.sessionStorage.removeItem('token'); // Supprime le token
            window.location.reload(); // Rafraîchir la page ou rediriger
        });
    } else {
        // Si l'utilisateur n'est pas connecté, attacher la fonctionnalité de connexion normale
        loginButton.addEventListener('click', function() {
            // Redirige vers la page de connexion
            window.location.href = 'loginPage.html';
        });
    }
});


document.addEventListener('DOMContentLoaded', checkLoginAndDisplayEditMode);


// Fonction pour gérer la déconnexion
function logout() {
    // Efface le token de sessionStorage
    window.sessionStorage.removeItem('token');

    // Actualise la page
        window.location.reload();
        console.log("Déconnexion réussie.");
}

