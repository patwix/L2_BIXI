// Fonction principale (initialise la carte et charge les informations de bixi)

$(document).ready(function () {
    initMap();
    chargerStations();
} );


// Fonctions pour la carte et les marqueurs Google Maps

var map;
var marker = null;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.522, lng: -73.775 },
        zoom: 10
    });
}

function placerMarqueur(coordonnees, nomStation){
    if (marker != null)
        marker.setMap(null);
    marker = new google.maps.Marker({
    position: coordonnees,
    map: map,
    title: nomStation,
    });    
}


// Chargement des informations de la base de donnees de bixi

let listeStations = {};
let stationsAutocomplete = [];
let stationsTableau = [];

function initTableau(){             //Initialise le tableau de l'onglet "Liste des stations"
    $('#tableauListe').DataTable({
        
        "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/French.json"
        },
        
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

function parseStation(station) {        // Extrait les données pertinentes de la base de données
    let newStation = {
        'id': station.id,
        'nom': station.s,
        'bloquee': station.b,
        'suspendue': station.su,
        'horsService': station.m,
        'latitude': station.la,
        'longitude': station.lo,
        'bornesDispo': station.da,
        'bornesIndispo': station.dx,
        'velosDispo': station.ba,
        'velosIndispo': station.bx,
    }
    return newStation;
}

function remplirTableauEtat(nomStation){        // Ajoute les données au tableau d'état de la station sélectionnée
    $( "#IDstation" ).text(listeStations[nomStation].id);
    if (listeStations[nomStation].bloquee){
        $( "#bloquee" ).text('Oui');
        document.getElementById("bloquee").classList.add("fondRouge");
    }
    else {
        $( "#bloquee" ).text('Non');
        document.getElementById("bloquee").classList.add("fondVert");
    }  
    $( "#bornesDis" ).text(listeStations[nomStation].bornesDispo);
    if (listeStations[nomStation].bornesDispo == 0)
        document.getElementById("bornesDis").classList.add("fondRouge");
    else
        document.getElementById("bornesDis").classList.add("fondVert");
    
    if (listeStations[nomStation].suspendue){
        $( "#suspendu" ).text('Oui');
        document.getElementById("suspendu").classList.add("fondRouge");
    }
    else{
        $( "#suspendu" ).text('Non');
        document.getElementById("suspendu").classList.add("fondVert");
    }
    $( "#HS" ).text(listeStations[nomStation].horsService);
    if (listeStations[nomStation].horsService){
        $( "#HS" ).text('Oui');
        document.getElementById("HS").classList.add("fondRouge");
    }
    else {
        $( "#HS" ).text('Non');
        document.getElementById("HS").classList.add("fondVert");
    }
    
    $( "#bornesND" ).text(listeStations[nomStation].bornesIndispo);
    $( "#veloDispo" ).text(listeStations[nomStation].velosDispo);
    if (listeStations[nomStation].bornesDispo == 0)
        document.getElementById("veloDispo").classList.add("fondRouge");
    else
        document.getElementById("veloDispo").classList.add("fondVert");
    $( "#veloND" ).text(listeStations[nomStation].velosIndispo);
}

function chargerStations(){             // Charge les données et appelle les autres fonctions
    $.get("https://secure.bixi.com/data/stations.json", function(reponse){
        
        $.map( reponse.stations, function( val, i ) {
            let temp = parseStation(val);
            listeStations[temp.nom] = temp;
            stationsAutocomplete[i] = temp.nom;
            stationsTableau[i] = [(temp.id).toString(), temp.nom, (temp.velosDispo).toString(), (temp.bornesDispo).toString(), (temp.bloquee).toString(), (temp.suspendue).toString()];
            if (stationsTableau[i][4] == "false")
                stationsTableau[i][4] = "Non";
            else
                stationsTableau[i][4] == "Oui";
                if (stationsTableau[i][5] == "false")
                stationsTableau[i][5] = "Non";
            else
                stationsTableau[i][5] == "Oui";
        });
        initTableau();  
        $(function() {
            $( "#nom" ).autocomplete({
                source: stationsAutocomplete,
                select: function(event, ui){
                    var nomStation = ui.item.label
                    var coordonnees = {lng: listeStations[nomStation].longitude, lat: listeStations[nomStation].latitude}
                    placerMarqueur(coordonnees, nomStation);
                    $("#selection").text(nomStation)
                    remplirTableauEtat(nomStation);                    
                },
            });
        });              
    });
}
