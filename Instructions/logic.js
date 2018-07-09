// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    // Loop through the cities array and create one marker for each city object
    for (var i = 0; i < feature.length; i++) {
      L.circle(feature[i].location, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: "purple",
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to the earthquakes magnitude
        radius: markerSize(feature[i].properties.mag)
      })
    }
    layer.bindPopup("<h3>" + feature.properties.title +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + 
      "access_token=pk.eyJ1IjoianR2b24yOSIsImEiOiJjamljYXQ1eXUwMjFrM3JvNXo5ZG91cW91In0.yphk-I8OenVzs--mdjMtDw");
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satellite
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 10,
      layers: [satellite, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  


