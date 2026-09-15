const map = L.map("map", { scrollWheelZoom: false }).setView([48.56638, 1.668055], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const commune = L.circleMarker([48.56638, 1.668055], {
  radius: 8,
  color: "#18332e",
  weight: 3,
  fillColor: "#ffffff",
  fillOpacity: 1
}).addTo(map);

commune.bindPopup("<strong>Gas (28320)</strong><br>Les points de suivi de l’eau seront ajoutés après vérification de leurs données.");

L.control.scale({ imperial: false }).addTo(map);
