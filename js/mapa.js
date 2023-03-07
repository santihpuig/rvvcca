// mapa

const sudOeste = new mapboxgl.LngLat(-0.4285753, 39.42969215);
const norEste = new mapboxgl.LngLat(-0.2553552, 39.498261);
const boundingBox = new mapboxgl.LngLatBounds(sudOeste, norEste);

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FudGlocHVpZyIsImEiOiJrYkhOMDVnIn0.ak6qwXtkOps01I5G-LCS_A";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/santihpuig/ck8ij0c3z0puc1iqxbb91u1pr",
  center: [-0.35050102772920705, 39.463210792046645],
  zoom: 13,
  maxBounds: boundingBox,
});
