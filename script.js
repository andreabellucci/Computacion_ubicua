// La funcionalidad minima requerida para este proyecto es:

// - Definir destino en el mapa,
// - Controlar si el usuario está en proximidad de su destino,
// - Vibrar si el usuario está cerca de su destino.

const mymap = L.map('sample_map').setView([40.741, -3.884], 15);

let myDestination = { latitude: 0.0, longitude: 0.0 };
let myCurrentPosition = { latitude: 0.0, longitude: 0.0 };

// Create the initial destination marker and added it to the map
var abc = new L.LatLng(0,0);
var myMarker = new L.marker(abc).addTo(mymap);

// let myMarker = new L.marker();

// Function that keeps track of the user position
setInterval(updatePosition, 1000);
setInterval(checkDistance, 1000);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);

//https://leafletjs.com/reference-1.7.1.html#interactive-layer-click
mymap.on('click', function (e) {
  var newLatLng = new L.LatLng(e.latlng.lat, e.latlng.lng);
  myMarker.setLatLng(newLatLng);
  console.log(myMarker);
  // myMarker = new L.marker(e.latlng).addTo(mymap);
  myDestination.latitude = e.latlng.lat;
  myDestination.longitude = e.latlng.lng;
});


function updatePosition() {
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log("[MIS COORDENADAS] Latitud: " + position.coords.latitude + ", Longitud: " + position.coords.longitude)
    myCurrentPosition.latitude = position.coords.latitude;
    myCurrentPosition.longitude = position.coords.longitude;
  });
}


function checkDistance() {

  // Adjust the amount of terrain that you consider as an error on the GPS precission
  error = 0.01;

  if (Math.abs(myCurrentPosition.latitude - myDestination.latitude) <= error) {
    if (Math.abs(myCurrentPosition.longitude - myDestination.longitude) <= error) {
      console.log("Cerca de cojones")
      // AQUÍ HABRÍA QUE VIBRAR GUAPARDO
    }
  }
}


// Que solo haiga una chincheta
// Que aparezca chinchetita de tu propia ubicación
