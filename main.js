// Initialisation de la carte google maps

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.522, lng: -73.775 },
        zoom: 10
    });
}

// Initialisation du tableau de la liste des stations

$(document).ready(function () {
    $("#tableau_liste").DataTable();
} );