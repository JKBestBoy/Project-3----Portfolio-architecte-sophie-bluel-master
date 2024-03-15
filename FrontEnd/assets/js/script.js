// Sélection des éléments du DOM.
const gallery = document.querySelector(".gallery"); // Sélectionne le conteneur principal de la galerie pour afficher les œuvres.
const filtersContainer = document.querySelector(".filter-container"); // Sélectionne le conteneur des filtres pour pouvoir y insérer des boutons de filtrage.
const editionButton = document.querySelector(".edition-button"); // Bouton d'édition, affiché uniquement aux utilisateurs connectés pour leur permettre de modifier la galerie.
const portfolioHeader = document.querySelector(".portfolio-header"); // L'entête du portfolio, susceptible de changer de style selon l'état de connexion.
const loginLink = document.querySelector("#loginButton a"); // Le lien de connexion/déconnexion dans le DOM.

// Définition des URLs de l'API pour récupérer les données nécessaires.
const CategoriesURL = "http://localhost:5678/api/categories";
const worksURL = "http://localhost:5678/api/works";

// Vérification de la présence du token.
const token = window.sessionStorage.getItem("token"); // Tente de récupérer le token depuis le stockage local.
console.log("Token:", token); // Affiche le token dans la console, s'il existe.

async function chooseMode() {
    // Ajuste l'interface utilisateur selon que l'utilisateur est connecté ou non.
    if (token !== null) {
        // Si l'utilisateur est connecté, montre le bouton d'édition et ajuste l'interface en conséquence.
        editionButton.classList.add("show");
        filtersContainer.classList.add("hide");
        portfolioHeader.classList.add("more-margin");
        loginLink.textContent = "logout"; // Change le texte en "logout" pour permettre la déconnexion.
        loginLink.addEventListener("click", logOut); // Attache un gestionnaire d'événement pour gérer la déconnexion.
    } else {
        // Si l'utilisateur n'est pas connecté.
        editionButton.classList.remove("show");
        filtersContainer.classList.remove("hide");
        const categories = await callDataApi(CategoriesURL); // Charge les catégories depuis l'API.
        createFiltersButton(categories); // Crée les boutons de filtre.
    }

    // Affiche les œuvres à partir de l'API.
    const works = await callDataApi(worksURL);
    if (works && gallery) {
        displayWorks(works); // Affiche les œuvres dans la galerie.
        manageFilters(); // Initialise la gestion des filtres.
    }
}

function logOut(event) {
    // Gère l'action de déconnexion.
    event.preventDefault(); // Empêche le comportement par défaut du lien.
    window.localStorage.removeItem("token"); // Supprime le token du stockage local.
    window.location.reload(); // Recharge la page.
}

document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edition-button');
    const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');

    // Si l'utilisateur n'est pas connecté (pas de token), masquer le bouton Modifier
    if (!userToken && editButton) {
        editButton.style.display = 'none';
    }

    const token = window.sessionStorage.getItem('token'); // ou localStorage selon où vous stockez le token
    if (token) {
        const editBar = document.createElement('div');
        editBar.classList.add('mode-edit-bar');

        const editIcon = document.createElement('span');
        editIcon.classList.add('mode-edit-icon');
        editIcon.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'; // Remplace l'icône

        const editText = document.createTextNode('Mode édition');

        editBar.appendChild(editIcon);
        editBar.appendChild(editText);
        document.body.insertBefore(editBar, document.body.firstChild);
        editBar.style.display = 'flex'; // Affiche la barre
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const userIsLoggedIn = !!window.sessionStorage.getItem('token'); // ou localStorage
    const filters = document.querySelectorAll('.filter-container'); // Assurez-vous que c'est le bon sélecteur pour vos éléments de filtre

    if (userIsLoggedIn) {
        filters.forEach(filter => {
            // Vérifie si le filtre n'est pas celui intitulé "Tous"
            if (!filter.classList.contains('filter-all')) {
                filter.style.display = 'none';
            }
        });
    }
});


function manageFilters() {
    // Gestionnaire d'événement au conteneur des filtres pour gérer les clics sur les filtres.
    filtersContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("filter")) {
            // Identifie le filtre cliqué et met à jour l'affichage des œuvres en conséquence.
            document.querySelectorAll(".filter").forEach(filter => filter.classList.remove("selected-filter"));
            event.target.classList.add("selected-filter");
            const selectedCategory = event.target.getAttribute("data-li-id");
            updateGalleryVisibility(selectedCategory); // Met à jour la visibilité des œuvres selon le filtre sélectionné.
        }
    });
}

function updateGalleryVisibility(selectedCategory) {
    // Met à jour la visibilité des figures dans la galerie selon la catégorie sélectionnée.
    document.querySelectorAll(".gallery figure").forEach(figure => {
        if (selectedCategory === "all" || figure.getAttribute("data-category-id") === selectedCategory) {
            figure.style.display = ""; // Montre l'élément si la catégorie correspond ou si "tous" est sélectionné.
        } else {
            figure.style.display = "none"; // Cache l'élément si la catégorie ne correspond pas.
        }
    });
}

function displayWorks(worksToDisplay) {
    // Affiche les œuvres dans la galerie, en créant dynamiquement le contenu HTML nécessaire.
    gallery.innerHTML = ""; // Réinitialise le contenu de la galerie.
    worksToDisplay.forEach(work => {
        // Pour chaque œuvre, crée les éléments HTML nécessaires et les ajoute à la galerie.
        const figureElement = document.createElement("figure");
        figureElement.setAttribute("data-category-id", work.category.id.toString()); // Associe l'œuvre à une catégorie.
        figureElement.setAttribute('data-id', work.id.toString()); // Attribue un identifiant unique à chaque œuvre.
        const img = document.createElement("img");
        img.src = work.imageUrl; // Définit l'URL de l'image.
        img.alt = work.title; // Ajoute un texte alternatif pour l'image.
        const caption = document.createElement("figcaption");
        caption.textContent = work.title; // Définit le titre de l'œuvre.
        figureElement.appendChild(img);
        figureElement.appendChild(caption);
        gallery.appendChild(figureElement); // Ajoute l'élément figure à la galerie.
    });
}

function createFiltersButton(categories) {
    // Crée et affiche les boutons de filtre basés sur les catégories fournies.
    filtersContainer.innerHTML = ""; // Réinitialise les filtres existants.
    const allFilter = document.createElement("li");
    allFilter.textContent = "Tous"; // Crée un filtre pour afficher toutes les catégories.
    allFilter.classList.add("filter", "selected-filter");
    allFilter.setAttribute("data-li-id", "all");
    filtersContainer.appendChild(allFilter); // Ajoute le filtre "Tous" au conteneur.

    // Crée un bouton de filtre pour chaque catégorie disponible.
    categories.forEach(category => {
        const li = document.createElement("li");
        li.textContent = category.name; // Définit le nom de la catégorie comme texte du bouton.
        li.classList.add("filter"); // Applique les classes CSS nécessaires.
        li.setAttribute("data-li-id", category.id.toString()); // Associe l'identifiant de la catégorie au bouton.
        filtersContainer.appendChild(li); // Ajoute le bouton de filtre au conteneur.
    });
}

async function callDataApi(url) {
    // Fonction pour appeler l'API et récupérer les données.
    try {
        const response = await fetch(url); // Tente de récupérer les données depuis l'URL fournie.
        if (!response.ok) throw new Error(`API call failed with status ${response.status}`); // Lance une erreur si la réponse n'est pas satisfaisante.
        return await response.json(); // Retourne le résultat de l'appel API sous forme d'objet JSON.
    } catch (error) {
        console.error('API call error:', error); // Affiche l'erreur en cas de problème avec l'appel API.
    }
}

chooseMode(); // Appelle la fonction principale pour initialiser la page en fonction de l'état de connexion.



// Soumission du formulaire de la modal et ajout de nouveaux projets
document.addEventListener('DOMContentLoaded', () => {
    const addWorkForm = document.getElementById('addPhotoForm');
    const imageInput = document.getElementById('imageUpload');
    const titleInput = document.getElementById('imageTitle');
    const categorySelect = document.getElementById('imageCategory');

    async function fetchAddProject(titleValue, selectedImage, selectedCategoryId) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("title", titleValue);
        formData.append("category", selectedCategoryId);
        const token = sessionStorage.getItem("token");
        const apiMessage = document.getElementById('apiMessage'); // Élément pour les réponses de l'API

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const responseData = await response.json(); // Supposons que l'API renvoie une réponse JSON

            if (response.ok) {
                apiMessage.textContent = "Votre projet a bien été ajouté à la base de données";
                apiMessage.style.color = "green"; // Optionnel : style pour le succès
                // Ici, vous pouvez également réinitialiser le formulaire ou mettre à jour l'UI comme nécessaire
            } else {
                // Gestion des erreurs côté serveur (par exemple, validation échouée)
                apiMessage.textContent = responseData.message || "Erreur lors de l'ajout du projet";
                apiMessage.style.color = "red"; // Optionnel : style pour les erreurs
            }
        } catch (error) {
            console.error("Erreur dans l'envoi du formulaire:", error);
            apiMessage.textContent = "Une erreur réseau est survenue.";
            apiMessage.style.color = "red"; // Optionnel : style pour les erreurs
        }
    }

    if(addWorkForm) {
        addWorkForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const selectedImage = imageInput.files[0];
            const titleValue = titleInput.value;
            const selectedCategoryId = categorySelect.value;

            // Appeler la fonction pour envoyer les données au serveur
            fetchAddProject(titleValue, selectedImage, selectedCategoryId);
        });
    }
});
