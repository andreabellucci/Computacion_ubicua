// La funcionalidad minima requerida para este proyecto es:

// - Definir destino en el mapa,
// - Controlar si el usuario está en proximidad de su destino,
// - Vibrar si el usuario está cerca de su destino.

const mymap = L.map('sample_map').setView([40.741, -3.884], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);

//https://leafletjs.com/reference-1.7.1.html#interactive-layer-click
mymap.on('click', function(e) {
  console.log(e);

})