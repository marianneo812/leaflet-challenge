// Replace 'yourDatasetURL' with the actual URL of the dataset you chose
const earthquakesURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Create the map
const map = L.map('map').setView([37.09, -95.71], 5); // Adjust the view to center on your area of interest

// Add a tile layer to add to our map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 20000; // Adjust this scaling factor as needed
}

// Function to choose marker color based on earthquake depth
function depthColor(depth) {
    if (depth > 90) return '#6a51a3'; // darkest purple
    else if (depth > 70) return '#807dba';
    else if (depth > 50) return '#9e9ac8';
    else if (depth > 30) return '#bcbddc';
    else if (depth > 10) return '#dadaeb'; // lighter purple
    else return '#ffffd4'; // light yellow
}


// Load the GeoJSON data and add to the map
fetch(earthquakesURL)
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.circle(latlng, {
                    radius: markerSize(feature.properties.mag),
                    fillColor: depthColor(feature.geometry.coordinates[2]),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
            }
        }).addTo(map);
    });

// Legend
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend'),
    depths = [-10, 10, 30, 50, 70, 90], // Depth ranges
    // Colors matched to the depthColor function
    colors = ['#ffffd4','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3']; // Corresponding colors

    // loop through our depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

legend.addTo(map);

