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
const perchloratesCanvas = document.getElementById("perchloratesChart");
const filter = document.getElementById("networkFilter");
let nitratesChart;
let perchloratesChart;

const isGas = item => item.reseau === "028001131 - GAS";
const isShared = item => item.reseau !== "028001131 - GAS";
const formatDate = value => new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));

function selectedData() {
  const mode = filter?.value || "gas";
  return (window.WATER_DATA || []).filter(item => mode === "tous" || (mode === "gas" ? isGas(item) : isShared(item)));
}

function renderWaterHistory() {
  const rows = selectedData();
  const nitrateRows = rows.filter(item => Number.isFinite(item.nitrates));
  const perchlorateRows = rows.filter(item => Number.isFinite(item.perchlorates));
  const latest = rows.at(-1);

  document.getElementById("analysisCount").textContent = rows.length.toLocaleString("fr-FR");
  document.getElementById("latestDate").textContent = latest ? formatDate(latest.date) : "—";
  document.getElementById("latestNitrate").textContent = latest?.nitrates?.toLocaleString("fr-FR", { minimumFractionDigits: 1 }) ?? "—";
  document.getElementById("latestPerchlorate").textContent = latest?.perchlorates?.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) ?? "Non mesuré";
  document.getElementById("latestConclusion").textContent = latest?.conclusion || "Aucune conclusion disponible.";
  document.getElementById("latestStatus").textContent = latest?.conclusion?.toLowerCase().includes("non conforme") ? "Point de vigilance ARS" : "Conforme selon l’ARS";

  nitratesChart?.destroy();
  perchloratesChart?.destroy();
  if (!chartCanvas || !window.Chart) return;

  nitratesChart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: nitrateRows.map(item => formatDate(item.date)),
      datasets: [
        {
          label: "Nitrates mesurés",
          data: nitrateRows.map(item => item.nitrates),
          borderColor: "#197e9f",
          backgroundColor: "rgba(25,126,159,.12)",
          pointBackgroundColor: "#197e9f",
          pointRadius: 2.5,
          pointHoverRadius: 6,
          borderWidth: 2,
          tension: .18,
          fill: true
        },
        {
          label: "Limite citée par l’ARS (50 mg/L)",
          data: nitrateRows.map(() => 50),
          borderColor: "#d95050",
          borderDash: [7, 6],
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { position: "bottom" },
        tooltip: { callbacks: { label: context => `${context.dataset.label} : ${Number(context.raw).toLocaleString("fr-FR")} mg/L` } }
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: 55, title: { display: true, text: "Nitrates (mg/L)" }, grid: { color: "#e5ece8" } },
        x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 }, grid: { display: false } }
      }
    }
  });

  if (perchloratesCanvas) {
    perchloratesChart = new Chart(perchloratesCanvas, {
      type: "line",
      data: {
        labels: perchlorateRows.map(item => formatDate(item.date)),
        datasets: [
          {
            label: "Perchlorates mesurés",
            data: perchlorateRows.map(item => item.perchlorates),
            borderColor: "#7655a6",
            backgroundColor: "rgba(118,85,166,.12)",
            pointBackgroundColor: "#7655a6",
            pointRadius: 4,
            pointHoverRadius: 7,
            borderWidth: 2,
            tension: .18,
            fill: true
          },
          {
            label: "Seuil cité dans les conclusions ARS (4 µg/L)",
            data: perchlorateRows.map(() => 4),
            borderColor: "#d95050",
            borderDash: [7, 6],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
          title: { display: true, text: "Perchlorates — uniquement lorsque le paramètre a été mesuré", color: "#18332e", font: { size: 16 } },
          legend: { position: "bottom" },
          tooltip: { callbacks: { label: context => `${context.dataset.label} : ${Number(context.raw).toLocaleString("fr-FR")} µg/L` } }
        },
        scales: {
          y: { beginAtZero: true, suggestedMax: 5, title: { display: true, text: "Perchlorates (µg/L)" }, grid: { color: "#e5ece8" } },
          x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 }, grid: { display: false } }
        }
      }
    });
  }
}

filter?.addEventListener("change", renderWaterHistory);
renderWaterHistory();
