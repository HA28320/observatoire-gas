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

const chartCanvas = document.getElementById("nitratesChart");

if (chartCanvas && window.Chart) {
  new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: ["Le Bourg", "Antenne de Moineaux"],
      datasets: [{
        label: "Nitrates (mg/L)",
        data: [35.9, 26.8],
        backgroundColor: ["#197e9f", "#24745f"],
        borderRadius: 7,
        maxBarThickness: 90
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Nitrates mesurés le 11 août 2026", color: "#18332e", font: { size: 17 } },
        tooltip: { callbacks: { label: context => `${context.raw.toLocaleString("fr-FR")} mg/L` } }
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: 40, title: { display: true, text: "Nitrates (mg/L)" }, grid: { color: "#e5ece8" } },
        x: { grid: { display: false } }
      }
    }
  });
}
