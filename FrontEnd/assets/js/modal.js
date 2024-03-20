// Récuperation des éléments du DOM
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("modal");
    const btn = document.getElementById("edition-button");
    const span = document.getElementsByClassName("close-button")[0];
    const modalGallery = document.querySelector(".modal-gallery");
    const modalForm = document.querySelector('.modal-form-content');
    const btnShowForm = document.getElementById('toggleFormButton');
    const btnBackToGallery = document.querySelector('.fas');
    const separator = document.querySelector('.form-separator');
    const urlApiGallery = "http://localhost:5678/api/works";

    // Appel de l'API pour récupérer les images et peupler la galerie modale
    async function recupererImagesGalerie() {
        try {
            const response = await fetch(urlApiGallery); // Appel de l'API
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }
            const travaux = await response.json(); // Conversion de la réponse en JSON
            peuplerGalerieModale(travaux); // Peupler la galerie modale avec les données récupérées
        } catch (error) {
            console.error("Impossible de charger les travaux pour la galerie :", error);
        }
    }

    // Peuple la galerie modale avec les images
    function peuplerGalerieModale(travaux) {
        modalGallery.innerHTML = ''; // Efface le contenu actuel de la galerie
        travaux.forEach(travail => {
            // Crée une figure pour chaque travail avec une image et un icône de suppression
            const figure = document.createElement('figure');
            figure.classList.add('gallery-item');
            figure.setAttribute('data-id', travail.id.toString());

            const img = document.createElement('img');
            img.src = travail.imageUrl;
            img.alt = travail.title;

            // Création de l'icône de suppression
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.setAttribute('data-work-id', travail.id);
            deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            figure.appendChild(img);
            figure.appendChild(deleteIcon);
            modalGallery.appendChild(figure);

            // Ajout d'un écouteur d'événement pour la suppression
            const token = window.sessionStorage.getItem('token') || window.localStorage.getItem('token');
            if (token) {
            removeWork(deleteIcon, token);
            }
        });
    }
    // Gestion de l'événement click pour la suppression d'une image
    function removeWork(deleteIcon, token) {
        deleteIcon.addEventListener("click", async event => {
            event.preventDefault();
            event.stopPropagation();
            // Vérifie si l'élément cliqué est l'icône à l'intérieur du span
            let targetElement = event.target;
            let workId;
            // Si l'élément cliqué est l'icône, utilisez son parent pour obtenir l'ID
            if (targetElement.tagName.toLowerCase() === 'i') {
                workId = targetElement.parentElement.getAttribute('data-work-id');
            } else {
                workId = targetElement.getAttribute('data-work-id');
            }
            try {
                await deleteWork(workId, token);
            } catch (error) {
                console.error('An error occurred during work removal: ', error);
            }
        });
    }
    
    // Suppression d'une image via l'API
    async function deleteWork(workId, token) {
        const response = await fetch(`${urlApiGallery}/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        document.querySelector(`.gallery-item[data-id="${workId}"]`).remove(); // Supprime l'élément de la galerie
    }

    // Affichage du formulaire
    function showForm() {
        modalGallery.style.display = 'none'; // Cache la galerie
        modalForm.style.display = 'block'; // Affiche le formulaire
        document.querySelector('.form-separator').style.display = 'none'; // Cache la barre de séparation

        var modalTitle = document.querySelector('.modal-title');
        if (modalTitle) modalTitle.textContent = 'Ajout photo'; // Définit le titre du formulaire
        var addButton = document.querySelector('.add-button');
        if (addButton) addButton.style.display = 'none'; // Cache le bouton d'ajout
        var formSeparator = document.querySelector('.form-separator');
        if (formSeparator) separator.style.display = 'none'; // Cache le séparateur de formulaire
    }

    // Récupération des catégories pour les formulaires
    async function chargerCategoriesPourFormulaires() {
        const urlCategorie = 'http://localhost:5678/api/categories'; // URL de l'API pour les catégories
        const selectCategorie = document.getElementById('imageCategory'); // Sélectionne la liste déroulante des catégories
    
        try {
            const reponse = await fetch(urlCategorie); // Appel de l'API
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP ! statut : ${reponse.status}`);
            }
            const categories = await reponse.json(); // Conversion de la réponse en JSON
    
            selectCategorie.innerHTML = ''; // Efface le contenu actuel de la liste déroulante
    
            selectCategorie.appendChild(new Option('', '')); // Ajoute une option vide
    
            // Ajoute chaque catégorie comme une option de la liste déroulante
            categories.forEach(categorie => {
                const option = document.createElement('option');
                option.value = categorie.id; 
                option.textContent = categorie.name;
                selectCategorie.appendChild(option);
            });
        } catch (erreur) {
            console.error("Erreur lors du chargement des catégories : ", erreur);
        }
    }
    
    document.addEventListener('DOMContentLoaded', chargerCategoriesPourFormulaires);
    
    // Gestionnaire d'événement pour afficher le formulaire
    btn.addEventListener('click', () => {
        chargerCategoriesPourFormulaires(); // S'assure que les catégories sont à jour
        recupererImagesGalerie(); // Récupère les images pour peupler la galerie modale
        modal.style.display = "block"; // Affiche le modal
        showGallery(); // Affiche la galerie par défaut

        const imageUploadInput = document.getElementById('imageUpload');
        const imageUploadContainer = document.querySelector('.image-upload-container');
    
        // Apperçu de l'image
        imageUploadInput.addEventListener('change', function(event) {
            const [file] = event.target.files;
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Supprimer l'icône et le bouton si nécessaire
                    imageUploadContainer.innerHTML = '';
    
                    // Créer l'élément img pour l'aperçu de l'image
                    const imgPreview = document.createElement('img');
                    imgPreview.src = e.target.result;
                    imgPreview.alt = 'Aperçu de l\'image';
                    imgPreview.style.maxWidth = '100%';
                    imgPreview.style.height = 'auto';  // Conserver le ratio de l'image
    
                    // Ajoute l'aperçu de l'image au conteneur
                    imageUploadContainer.appendChild(imgPreview);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Affichage de la galerie
    function showGallery() {
        modalGallery.style.display = 'grid'; // Affiche la galerie
        modalForm.style.display = 'none'; // Cache le formulaire
        document.querySelector('.form-separator').style.display = 'block'; // Affiche le séparateur de formulaire
        var modalTitle = document.querySelector('.modal-title');
        if (modalTitle) modalTitle.textContent = 'Galerie photo'; // Définit le titre de la modal
        var addButton = document.querySelector('.add-button');
        if (addButton) addButton.style.display = 'block'; // Affiche le bouton d'ajout
        var formSeparator = document.querySelector('.form-separator');
        if (formSeparator) separator.style.display = 'block'; // Affiche le séparateur de formulaire
    } 

    // Gestionnaire d'événement pour afficher la galerie
    btn.addEventListener('click', () => {
        recupererImagesGalerie(); // Récupère les images pour peupler la galerie modale
        modal.style.display = "block"; // Affiche le modal
        showGallery(); // Affiche la galerie par défaut
    });

     // Gestionnaire d'événement pour fermer la modal en cliquant sur le bouton de fermeture
    span.addEventListener('click', () => {
        modal.style.display = "none"; // Cache le modal
    });

    // Gestionnaire d'événement pour fermer la modal en cliquant en dehors de celle-ci
    window.addEventListener('click', event => {
        if (event.target == modal) {
            modal.style.display = "none"; // Cache le modal
        }
    });

    // Gestionnaire d'événement pour afficher le formulaire
    btnShowForm.addEventListener('click', showForm);

    // Gestionnaire d'événement pour revenir à la galerie depuis le formulaire
    btnBackToGallery.addEventListener('click', showGallery);
});