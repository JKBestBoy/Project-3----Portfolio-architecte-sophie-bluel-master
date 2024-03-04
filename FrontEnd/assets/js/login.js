// Sélectionner le formulaire
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

                // Stocker le token dans sessionStorage
                window.sessionStorage.setItem('token', token);
                
                // Rediriger l'utilisateur ou actualiser la page pour montrer qu'il est connecté
                window.location.href = 'index.html'
                console.log("Connexion réussie, token stocké.");
            } else {
                // Gérer les erreurs d'identifiants
                throw new Error("Erreur dans l'identifiant ou le mot de passe");
            }
        } catch (error) {
            // Afficher l'erreur en console et informer l'utilisateur
            console.error("Une erreur s'est produite:", error);
            alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.");
        }
    }

    // Appeler la fonction fetchUser
    fetchUser();
});

document.addEventListener('DOMContentLoaded', (event) => {
    const loginButton = document.getElementById('loginButton');

    // Vérifier si l'utilisateur est connecté
    const token = window.sessionStorage.getItem('token');
    if (token) {
        // Modifier le texte et la fonctionnalité pour le logout
        loginButton.textContent = 'logout';
        loginButton.addEventListener('click', function() {
            // Fonctionnalité de déconnexion
            window.sessionStorage.removeItem('token'); // Supprimer le token
            window.location.reload(); // Rafraîchir la page ou rediriger
        });
    } else {
        // Si l'utilisateur n'est pas connecté, attacher la fonctionnalité de connexion normale
        loginButton.addEventListener('click', function() {
            // Rediriger vers la page de connexion ou ouvrir un modal de connexion, etc.
            window.location.href = 'loginPage.html'; // Exemple de redirection vers la page de connexion
        });
    }
});

// Fonction pour gérer la déconnexion
function logout() {
    // Effacer le token de sessionStorage
    window.sessionStorage.removeItem('token');

    // Rediriger l'utilisateur vers la page de connexion ou actualiser la page
        window.location.reload();
        console.log("Déconnexion réussie.");
}

