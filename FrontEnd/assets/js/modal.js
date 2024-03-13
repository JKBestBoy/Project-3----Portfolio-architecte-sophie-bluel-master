// modal.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("modal");
    const btn = document.getElementById("edition-button");
    const span = document.getElementsByClassName("close-button")[0];
    const modalGallery = document.querySelector(".modal-gallery");
    const modalForm = document.querySelector('.modal-form-content');
    const btnShowForm = document.getElementById('toggleFormButton');
    const btnBackToGallery = document.querySelector('.fas');
    const urlApiGallery = "http://localhost:5678/api/works";
    const urlCategorie = 'http://localhost:5678/api/categories';

    // Appel de l'API pour récupérer les images et peupler la galerie modale
    async function recupererImagesGalerie() {
        try {
            const response = await fetch(urlApiGallery);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }
            const travaux = await response.json();
            peuplerGalerieModale(travaux);
        } catch (error) {
            console.error("Impossible de charger les travaux pour la galerie :", error);
        }
    }

    // Peuple la galerie modale avec les images
    function peuplerGalerieModale(travaux) {
        modalGallery.innerHTML = ''; // Efface le contenu actuel de la galerie
        travaux.forEach(travail => {
            const figure = document.createElement('figure');
            figure.classList.add('gallery-item');
            figure.setAttribute('data-id', travail.id.toString());

            const img = document.createElement('img');
            img.src = travail.imageUrl;
            img.alt = travail.title;

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.setAttribute('data-work-id', travail.id);
            deleteIcon.textContent = '🗑';
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
            try {
                const workId = event.target.getAttribute('data-work-id');
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
        document.querySelector(`.gallery-item[data-id="${workId}"]`).remove();
    }

    

    // Affichage du formulaire
    function showForm() {
        modalGallery.style.display = 'none';
        modalForm.style.display = 'block';
        document.querySelector('.form-separator').style.display = 'none'; // Cache la barre de séparation
        var modalTitle = document.querySelector('.modal-title'); // Assurez-vous que '.modal-title' est le sélecteur correct pour votre titre de modale
        if (modalTitle) modalTitle.textContent = 'Ajout photo';
        var addButton = document.querySelector('.add-button'); // Utilisez le sélecteur correct pour votre bouton
        if (addButton) addButton.style.display = 'none';
        var formSeparator = document.querySelector('.form-separator');
        if (formSeparator) separator.style.display = 'none';    }


    async function chargerCategoriesPourFormulaires() {
        const urlCategorie = 'http://localhost:5678/api/categories';
        const selectCategorie = document.getElementById('imageCategory');
    
        try {
            const reponse = await fetch(urlCategorie);
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP ! statut : ${reponse.status}`);
            }
            const categories = await reponse.json();
    
            // Assurez-vous que l'élément select est vide avant d'ajouter de nouvelles options
            selectCategorie.innerHTML = '';
    
            // Créez une option par défaut si nécessaire
            selectCategorie.appendChild(new Option('', ''));
    
            // Utilisez la propriété correcte de votre réponse JSON ici
            categories.forEach(categorie => {
                const option = document.createElement('option');
                option.value = categorie.id; 
                option.textContent = categorie.name; // Assurez-vous que 'name' est la propriété correcte
                selectCategorie.appendChild(option);
            });
        } catch (erreur) {
            console.error("Erreur lors du chargement des catégories : ", erreur);
            // Gérez l'erreur comme il se doit, peut-être en affichant un message à l'utilisateur
        }
    }
    
    document.addEventListener('DOMContentLoaded', chargerCategoriesPourFormulaires);
    
    btn.addEventListener('click', () => {
        chargerCategoriesPourFormulaires(); // S'assure que les catégories sont à jour
        recupererImagesGalerie();
        modal.style.display = "block";
        showGallery(); // S'assure que la galerie est affichée par défaut

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
                    imgPreview.style.maxWidth = '100%';  // Ou toute autre style nécessaire
                    imgPreview.style.height = 'auto';  // Conserver le ratio de l'image
    
                    // Ajouter l'aperçu de l'image au conteneur
                    imageUploadContainer.appendChild(imgPreview);
                };
                reader.readAsDataURL(file);
            }
        });
    });
      




    


    // Affichage de la galerie
    function showGallery() {
        modalGallery.style.display = 'grid';
        modalForm.style.display = 'none';
        document.querySelector('.form-separator').style.display = 'block'; // Assurez-vous d'afficher la barre de séparation
        var modalTitle = document.querySelector('.modal-title'); // Assurez-vous que '.modal-title' est le sélecteur correct pour votre titre de modale
        if (modalTitle) modalTitle.textContent = 'Galerie photo';
        var addButton = document.querySelector('.add-button'); // Utilisez le sélecteur correct pour votre bouton
        if (addButton) addButton.style.display = 'block';
        var separator = document.querySelector('.form-separator');
        if (separator) separator.style.display = 'block';
    }

    btn.addEventListener('click', () => {
        recupererImagesGalerie();
        modal.style.display = "block";
        showGallery(); // S'assure que la galerie est affichée par défaut
    });

    span.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', event => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    btnShowForm.addEventListener('click', showForm);
    btnBackToGallery.addEventListener('click', showGallery);
});
