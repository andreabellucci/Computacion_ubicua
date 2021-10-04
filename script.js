const mymap = L.map('sample_map').setView([40.416729, -3.703339], 10);

let flagIcon = L.Icon.extend({
  options: {
    iconUrl: 'https://img.icons8.com/cotton/2x/000000/finish-flag.png',
    shadowUrl: 'https://img1.picmix.com/output/stamp/normal/5/9/2/9/469295_ad0b5.png',
    iconSize: 47,
    shadowSize: 40,
    iconAnchor: [20, 46],
    shadowAnchor: [21, 23],
    popupAnchor: [-3, -76]
  }
});

let destinationIcon = new flagIcon();

// Create the initial destination marker and added it to the map
let myDestination = new L.marker([0.0, 0.0], { icon: destinationIcon, title: "Destination" }).addTo(mymap);
let myPosition = new L.marker([0.0, 0.0], { title: "Actual Position" }).addTo(mymap);

// Don't start the program until there is a destination
let start = false;

// Keep track with the user and check if he's close to destination
setInterval(updatePosition, 1000);
setInterval(checkDistance, 1000);
setInterval(calculateDistance, 1000);


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
        console.log("[== THE DESTINATION IS CLOSE ==]"); // For PC or devices without vibration
        navigator.vibrate([50, 10, 100, 10, 50, 0, 50]); // Vibration pattern
      } else
        navigator.vibrate(0); // To cancel the vibration if we change the marker
    } else
      navigator.vibrate(0); // To cancel the vibration if we change the marker
  }
}

function calculateDistance() {  // generally used geo measurement function
  if (start) {
    var R = 6378.137; // Radius of earth in KM
    var dLat = myPosition._latlng.lat * Math.PI / 180 - myDestination._latlng.lat * Math.PI / 180;
    var dLon = myPosition._latlng.lng * Math.PI / 180 - myDestination._latlng.lng * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(myDestination._latlng.lat * Math.PI / 180) * Math.cos(myPosition._latlng.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    var result = d * 1000; // meters
    document.getElementById("distance_indicator").innerText = Math.round(result) + " meters";

  }else{
    document.getElementById("distance_indicator").innerText = "Waiting for Destination...";
  }
}

// Function to center the view on the users position
function centerView() {
  mymap.setView(myPosition._latlng, 25);
}