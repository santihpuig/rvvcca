// datos

var datos = {
  type: "geojson",
  data: "data/medicion.geojson",
};

var media = {
  type: "geojson",
  data: "data/media.geojson",
};

// estilo círculos

var circulosMedia = {
  "circle-radius": ["/", ["-", 5, ["number", ["get", "avg"], 0.5]], 1],
  "circle-stroke-color": "#ffb703",
  "circle-color": "#ffb703",
  "circle-stroke-width": 1,
  "circle-stroke-opacity": 1,
  "circle-opacity": 0,
};

var circulos = {
  "circle-radius": ["/", ["-", 5, ["number", ["get", "avg"], 0.25]], 1],
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

// condiciones

map.on("load", function () {
  var filtroHora = ["==", ["number", ["get", "hour"]], 12];
  var filtroViento = ["match", ["get", "viento"], "todas", true, false];

  map.addLayer({
    id: "mediciones",
    type: "circle",
    source: datos,
    paint: circulos,
    filter: ["all", filtroHora, filtroViento],
  });

  map.addLayer({
    id: "medias",
    type: "circle",
    source: media,
    paint: circulosMedia,
  });

  document.getElementById("slider").addEventListener("input", function (e) {
    const hour = parseInt(e.target.value);

    // update the map
    filtroHora = ["==", ["number", ["get", "hour"]], hour];
    map.setFilter("mediciones", ["all", filtroHora, filtroViento]);

    // update text in the UI
    document.getElementById("active-hour").innerText = hour + " hrs.";
  });

  // aún no se

  document.getElementById("filters").addEventListener("change", (event) => {
    const condiciones = event.target.value;
    // update the map filter
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
});
