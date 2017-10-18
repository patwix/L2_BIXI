// Initialisation de la carte google maps
var map;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.522, lng: -73.775 },
        zoom: 10
    });
}


// Chargement des informations de la base de donnees de bixi


let listeStations = {};
let nomsStations = {};
let tableauStations = {};

$(document).ready(function () {
    chargerStations();
    $("#tableau_liste").DataTable({
        data: tableauStations,
        columns: [
            { title: "ID" },
            { title: "Nom Station" },
            { title: "Vélos disponibles" },
            { title: "Bornes disponibles" },
            { title: "État bloqué" },
            { title: "État suspendu" }
        ]
    });
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
            tableauStations[temp.id] = [temp.id, temp.nom, temp.velos-dispo, temp.bornes-dispo, temp.bloquee, temp.suspendue];
        });
    });
}

$(function() {
    $( "#nom" ).autocomplete({
        source: nomsStations
    });
});

