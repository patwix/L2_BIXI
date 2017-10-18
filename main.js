// Initialisation de la carte google maps
var map;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.522, lng: -73.775 },
        zoom: 10
    });
}


// Initialisation du tableau de la liste des stations


let listeStations = {};
let nomsStations = {};

$(document).ready(function () {
    chargerStations();
    $("#tableau_liste").DataTable();
} );

function parseStation(station) {
    let newStation = {
        'id': station.id,
        'nom': station.s,
        'bloquee': station.b,
        'suspendue': station.su,
        'hors-service': station.m,
        'latitude': station.la,
        'longitude': station.lo,
        'bornes-dispo': station.da,
        'bornes-indispo': station.dx,
        'velos-dispo': station.ba,
        'velos-indispo': station.bx,
    }
    return newStation;
}

function chargerStations(){
    $.get("https://secure.bixi.com/data/stations.json", function(reponse){
        
        $.map( reponse.stations, function( val, i ) {
            let temp = parseStation(val);
            listeStations[temp.nom] = temp;
            nomsStations[temp.id] = temp.nom;
        });
    });
}

$(function() {
    $( "#nom" ).autocomplete({
        source: nomsStations
    });
});

