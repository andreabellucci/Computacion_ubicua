const mymap = L.map('sample_map').setView([40.416729, -3.703339], 10);

// Don't start the program until there is a destination
let start = false;

// Create the initial destination marker and added it to the map
let myDestination = new L.marker([0.0, 0.0], { title: "Destination" }).addTo(mymap);
let myPosition = new L.marker([0.0, 0.0], { title: "Actual Position" }).addTo(mymap);

// Keep track with the user and check if he's close to destination
setInterval(updatePosition, 1000);
setInterval(checkDistance, 1000);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);

//https://leafletjs.com/reference-1.7.1.html#interactive-layer-click
mymap.on('click', function (e) {
  start = true;
  var newLatLng = new L.LatLng(e.latlng.lat, e.latlng.lng);
  myDestination.setLatLng(newLatLng);
});


function updatePosition() {
  navigator.geolocation.getCurrentPosition(function (position) {
    var newLatLng = new L.LatLng(position.coords.latitude, position.coords.longitude);
    myPosition.setLatLng(newLatLng);
  });
}


function checkDistance() {

  // Adjust the amount of terrain that you consider as an error on the GPS precission
  error_area = 0.001;

  // console.log("[POSICIÓN]: " + myPosition._latlng);
  // console.log("[DESTINO]: " + myDestination._latlng);

  if (start) {
    if (Math.abs(myPosition._latlng.lat - myDestination._latlng.lat) <= error_area) {
      if (Math.abs(myPosition._latlng.lng - myDestination._latlng.lng) <= error_area) {
        console.log("[== DESTINO CERCA ==]");
        navigator.vibrate();
      }
    }
  }
}
