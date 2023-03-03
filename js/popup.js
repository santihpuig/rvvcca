// popup on hover

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.on("mouseenter", "medias", function (e) {
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = "pointer";

  var coordinates = e.features[0].geometry.coordinates.slice();
  var description = e.features[0].properties.avg + " ug/m<sup>3</sup>";

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML(description).addTo(map);
});

map.on("mouseleave", "medias", function () {
  map.getCanvas().style.cursor = "";
  popup.remove();
});
