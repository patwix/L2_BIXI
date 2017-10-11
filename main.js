var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.522, lng: -73.775 },
        zoom: 10
    });
}