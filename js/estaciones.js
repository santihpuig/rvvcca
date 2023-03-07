// origen de los datos

var medicionesHorarias = {
  type: "geojson",
  data: "data/medicion.geojson",
};

var mediasAnuales = {
  type: "geojson",
  data: "data/media.geojson",
};

var vientosDominantes = {
  type: "geojson",
  data: "data/viento.geojson",
};

// estilos

var textoMedias = {
  "text-field": ["get", "etiqueta"],
  "text-font": ["Arial Unicode MS Bold"],
  "text-anchor": "bottom-left",
  "text-justify": "left",
  "text-size": 12,
};

var circuloMedias = {
  "text-halo-color": "rgba(255, 255, 255, 0.9)",
  "text-halo-width": 2,
  "text-color": "#03071e",
};

var circuloEstaciones = {
  "circle-radius": [
    "interpolate",
    ["linear"],
    ["number", ["get", "avg"]],
    10,
    10,
    60,
    60,
  ],
  "circle-color": [
    "interpolate",
    ["linear"],
    ["number", ["get", "avg"]],
    10,
    "#d00000",
    60,
    "#370617",
  ],
  "circle-opacity": 1,
};

var estiloViento = {
  "icon-opacity": 0.35,
};

var layoutViento = {
  "icon-image": "flecha", // reference the image
  "icon-size": [
    "interpolate",
    ["linear"],
    ["number", ["get", "avgveloc"]],
    1.83,
    0.2,
    2.42,
    0.6,
  ],
  "icon-rotate": [
    "interpolate",
    ["linear"],
    ["number", ["get", "avgdirec"]],
    1,
    1,
    360,
    360,
  ],
  visibility: "none",
};

// carga datos con filtros

map.on("load", function () {
  var filtroHora = ["==", ["number", ["get", "hour"]], 8];
  var filtroViento = ["match", ["get", "viento"], "todas", true, false];

  map.loadImage("/css/arrow.png", (error, image) => {
    if (error) throw error;

    map.addImage("flecha", image);
  });

  map.addLayer({
    id: "Visualizar vientos dominantes [x]",
    type: "symbol",
    source: vientosDominantes,
    paint: estiloViento,
    layout: layoutViento,
  });

  map.addLayer({
    id: "mediciones",
    type: "circle",
    source: medicionesHorarias,
    paint: circuloEstaciones,
    filter: ["all", filtroHora, filtroViento],
  });

  map.addLayer({
    id: "medias",
    type: "symbol",
    source: mediasAnuales,
    paint: circuloMedias,
    layout: textoMedias,
  });

  document.getElementById("slider").addEventListener("input", function (e) {
    const hour = parseInt(e.target.value);

    // actualiza el mapa
    filtroHora = ["==", ["number", ["get", "hour"]], hour];
    map.setFilter("mediciones", ["all", filtroHora, filtroViento]);

    // actualiza el texto en la consola
    document.getElementById("active-hour").innerText = hour + " hrs.";
  });

  // filtra en función de las condiciones

  document.getElementById("filters").addEventListener("change", (event) => {
    const condiciones = event.target.value;
    if (condiciones === "all") {
      filtroViento = ["match", ["get", "viento"], "todas", true, false];
    } else if (condiciones === "calma") {
      filtroViento = ["match", ["get", "viento"], "calma", true, false];
    } else if (condiciones === "muybaja") {
      filtroViento = ["match", ["get", "viento"], "muybaja", true, false];
    } else if (condiciones === "baja") {
      filtroViento = ["match", ["get", "viento"], "baja", true, false];
    } else if (condiciones === "moderada") {
      filtroViento = ["match", ["get", "viento"], "moderada", true, false];
    } else if (condiciones === "alta") {
      filtroViento = ["match", ["get", "viento"], "alta", true, false];
    } else if (condiciones === "muyalta") {
      filtroViento = ["match", ["get", "viento"], "muyalta", true, false];
    } else {
      console.error("error");
    }
    map.setFilter("mediciones", ["all", filtroHora, filtroViento]);
  });

  // After the last frame rendered before the map enters an "idle" state.
  map.on("idle", () => {
    // If these two layers were not added to the map, abort
    if (!map.getLayer("Visualizar vientos dominantes [x]")) {
      return;
    }

    // Enumerate ids of the layers.
    const toggleableLayerIds = ["Visualizar vientos dominantes [x]"];

    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
      // Skip layers that already have a button set up.
      if (document.getElementById(id)) {
        continue;
      }

      // Create a link.
      const link = document.createElement("a");
      link.id = id;
      link.href = "#";
      link.textContent = id;
      link.className = "active";

      // Show or hide layer when the toggle is clicked.
      link.onclick = function (e) {
        const clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        const visibility = map.getLayoutProperty(clickedLayer, "visibility");

        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === "visible") {
          map.setLayoutProperty(clickedLayer, "visibility", "none");
          this.className = "";
        } else {
          this.className = "active";
          map.setLayoutProperty(clickedLayer, "visibility", "visible");
        }
      };

      const layers = document.getElementById("menu");
      layers.appendChild(link);
    }
  });
});
