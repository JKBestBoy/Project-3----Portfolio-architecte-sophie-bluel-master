// Sélection des éléments du DOM pour manipulation ultérieure.
const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filter-container");
const editionButton = document.querySelector(".edition-button");
const portfolioHeader = document.querySelector(".portfolio-header");
const loginLink = document.querySelector("#loginButton a"); // Assurez-vous que cela correspond à l'élément correct.

// Définition des URLs de l'API pour récupérer les données nécessaires.
const CategoriesURL = "http://localhost:5678/api/categories";
const worksURL = "http://localhost:5678/api/works";

// Vérification de la présence d'un token de connexion.
const token = window.localStorage.getItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4");
console.log("Token:", window.localStorage.getItem("token"));

async function chooseMode() {
    if (token !== null) {
        // Utilisateur connecté : Activer le mode édition.
        editionButton.classList.add("show");
        filtersContainer.classList.add("hide"); // Cache les filtres.
        portfolioHeader.classList.add("more-margin");
        loginLink.textContent = "logout"; // Change le texte en "logout".
        loginLink.href = "javascript:void(0)"; // Prévenir le comportement par défaut du lien.
        loginLink.addEventListener("click", logOut); // Ajoute un écouteur d'événement pour gérer la déconnexion.
    } else {
        // Utilisateur non connecté : Masquer le mode édition et afficher les filtres.
        editionButton.classList.remove("show");
        filtersContainer.classList.remove("hide"); // Affiche les filtres.
        const categories = await callDataApi(CategoriesURL);
        createFiltersButton(categories);
    }

    // Affichage des travaux.
    const works = await callDataApi(worksURL);
    if (works && gallery) {
        displayWorks(works);
        manageFilters(); // Gestion des filtres.
    }
}

function logOut(event) {
    event.preventDefault();
    window.localStorage.removeItem("token");
    window.location.reload(); // Recharge la page pour refléter l'état de connexion.
}

function manageFilters() {
    filtersContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("filter")) {
            document.querySelectorAll(".filter").forEach(filter => filter.classList.remove("selected-filter"));
            event.target.classList.add("selected-filter");
            const selectedCategory = event.target.getAttribute("data-li-id");
            updateGalleryVisibility(selectedCategory);
        }
    });
}

function updateGalleryVisibility(selectedCategory) {
    document.querySelectorAll(".gallery figure").forEach(figure => {
        if (selectedCategory === "all" || figure.getAttribute("data-category-id") === selectedCategory) {
            figure.style.display = "";
        } else {
            figure.style.display = "none";
        }
    });
}

function displayWorks(worksToDisplay) {
    gallery.innerHTML = ""; // Efface les contenus existants de la galerie.
    worksToDisplay.forEach(work => {
        const figureElement = document.createElement("figure");
        figureElement.setAttribute("data-category-id", work.category.id.toString());
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        const caption = document.createElement("figcaption");
        caption.textContent = work.title;
        figureElement.appendChild(img);
        figureElement.appendChild(caption);
        gallery.appendChild(figureElement);
    });
}

function createFiltersButton(categories) {
    filtersContainer.innerHTML = ""; // Efface les filtres existants.
    // Ajout du filtre "Tous".
    const allFilter = document.createElement("li");
    allFilter.textContent = "Tous";
    allFilter.classList.add("filter", "selected-filter");
    allFilter.setAttribute("data-li-id", "all");
    filtersContainer.appendChild(allFilter);

    categories.forEach(category => {
        const li = document.createElement("li");
        li.textContent = category.name;
        li.classList.add("filter");
        li.setAttribute("data-li-id", category.id.toString()); // Assurez-vous que l'ID est une chaîne pour la comparaison.
        filtersContainer.appendChild(li);
    });
}

async function callDataApi(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API call failed with status ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
    }
}

chooseMode();
