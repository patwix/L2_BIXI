// Initialisation de la carte google maps
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.522, lng: -73.775 },
        zoom: 10
    });
}

function placerMarqueur(coordonnees, nomStation){
    var marker = new google.maps.Marker({
        position: coordonnees,
        map: map,
        title: nomStation,
    });    
}


// Chargement des informations de la base de donnees de bixi


let listeStations = {};
let stationsAutocomplete = [];
var stationsTableau = [];

$(document).ready(function () {
    initMap();
    chargerStations();
} );

function initTableau(){
    $('#tableauListe').DataTable({
        data: stationsTableau,
        columns: [
            { title: "ID" },
            { title: "Nom Station" },
            { title: "Vélos disponibles" },
            { title: "Bornes disponibles" },
            { title: "État bloqué" },
            { title: "État suspendu" }
        ]
    });
}

function parseStation(station) {
    let newStation = {
        'id': station.id,
        'nom': station.s,
        'bloquee': station.b,
        'suspendue': station.su,
        'hors-service': station.m,
        'latitude': station.la,
        'longitude': station.lo,
        'bornesDispo': station.da,
        'bornesIndispo': station.dx,
        'velosDispo': station.ba,
        'velosIndispo': station.bx,
    }
    return newStation;
}

function chargerStations(){
    $.get("https://secure.bixi.com/data/stations.json", function(reponse){
        
        $.map( reponse.stations, function( val, i ) {
            let temp = parseStation(val);
            listeStations[temp.nom] = temp;
            stationsAutocomplete[i] = temp.nom;
            stationsTableau[i] = [(temp.id).toString(), temp.nom, (temp.velosDispo).toString(), (temp.bornesDispo).toString(), (temp.bloquee).toString(), (temp.suspendue).toString()];
        });
        initTableau();  
        $(function() {
            $( "#nom" ).autocomplete({
                source: stationsAutocomplete,
                select: function(event, ui){
                    var nomStation = ui.item.label
                    var coordonnees = {lng: listeStations[nomStation].longitude, lat: listeStations[nomStation].latitude}
                    placerMarqueur(coordonnees, nomStation);
                },
            });
        });              
    });
}
