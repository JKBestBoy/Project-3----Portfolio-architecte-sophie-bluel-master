// Obtenir les éléments
var modal = document.getElementById("modal");
var btn = document.getElementById("edition-button"); // Le bouton qui ouvre la modale
var span = document.getElementsByClassName("close-button")[0]; // Le <span> qui ferme la modale
var modalGallery = document.querySelector(".modal-gallery"); // La galerie à l'intérieur de la modale

// URL de l'API qui retourne les images pour la galerie
var urlApiGallery = "http://localhost:5678/api/works";

// Fonction pour appeler l'API et récupérer les travaux pour la galerie
async function recupererImagesGalerie() {
    try {
        let reponse = await fetch(urlApiGallery);
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! statut : ${reponse.status}`);
        }
        let travaux = await reponse.json();
        peuplerGalerieModale(travaux);
    } catch (erreur) {
        console.error("Impossible de charger les travaux pour la galerie :", erreur);
    }
}


// Fonction pour remplir la galerie modale avec les images reçues de l'API
function peuplerGalerieModale(travaux) {
    modalGallery.innerHTML = ''; // Effacer le contenu actuel de la galerie
    travaux.forEach(function(travail) {
        var figure = document.createElement('figure');
        figure.classList.add('gallery-item');

        var img = document.createElement('img');
        img.src = travail.imageUrl;
        img.alt = travail.title;
        
        var deleteIcon = document.createElement('span');
        deleteIcon.classList.add('delete-icon');
        deleteIcon.textContent = '🗑'; // Utilisez ici une icône ou une image de poubelle

        // Attacher un écouteur d'événements au clic de l'icône de suppression
        deleteIcon.onclick = function() {
            figure.remove();
        };

        figure.appendChild(img);
        figure.appendChild(deleteIcon);
        modalGallery.appendChild(figure);
    });
}

// Assurez-vous que le CSS est correct pour positionner l'icône de suppression et pour afficher les images correctement


// Quand l'utilisateur clique sur le bouton, ouvrir la modale et charger les images
btn.onclick = function() {
    recupererImagesGalerie(); // Appeler l'API et peupler la galerie
    modal.style.display = "block"; // Afficher la modale
}

// Quand l'utilisateur clique sur <span> (x), fermer la modale
span.onclick = function() {
    modal.style.display = "none";
}

// Quand l'utilisateur clique à l'extérieur de la modale, la fermer
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

