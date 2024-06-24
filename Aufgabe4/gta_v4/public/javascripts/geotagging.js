// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

function updateLocation() {
    // Get the form elements for latitude and longitude
    let latElement = document.getElementById('lat');
    let longElement = document.getElementById('long');
    let discoveryLatElement = document.getElementById('discoveryLatitude');
    let discoveryLongElement = document.getElementById('discoveryLongitude');

    // Check if coordinates are already entered
    let latitudes = latElement.value;
    let longitudes = longElement.value;

    // Find the <img> element by its id and remove it
    let mapViewImg = document.getElementById('mapView');
    if (mapViewImg) {
        mapViewImg.remove();
    }

    // Find the <p> element by its parent and remove it
    let mapViewSpan = document.querySelector('.discovery__map span');
    if (mapViewSpan) {
        mapViewSpan.remove();
    }

    if (!latitudes || !longitudes) {
        // If either latitude or longitude is empty, find location
        LocationHelper.findLocation((location) => {
            // Log the location object
            console.log("Location object received: ", location);

            latitude = location.latitude;
            longitude = location.longitude;

            // Set the form elements with the new coordinates
            latElement.value = latitude;
            longElement.value = longitude;
            discoveryLatElement.value = latitude;
            discoveryLongElement.value = longitude;

            // Log the updated coordinates
            console.log("Updated coordinates: ", latitude, longitude);

            // Initialize map and update markers
            mapManager = new MapManager();
            mapManager.initMap(latitude, longitude);

            // Get the GeoTag objects from the data attribute
            geoTags = JSON.parse(document.getElementById('map').getAttribute('data-tags'));
            console.log("GeoTags: ", geoTags);

            mapManager.updateMarkers(latitude, longitude, geoTags);
            
        });
    } else {
        // Log the existing coordinates
        console.log("Existing coordinates: ", latitudes, longitudes);

        // Initialize map and update markers with existing coordinates
        mapManager = new MapManager();
        mapManager.initMap(latitudes, longitudes);

        // Get the GeoTag objects from the data attribute
        geoTags = JSON.parse(document.getElementById('map').getAttribute('data-tags'));
        console.log("GeoTags: ", geoTags);

        mapManager.updateMarkers(latitudes, longitudes, geoTags);
    }
}



// Function to handle the AJAX request for tagging
async function submitTaggingForm(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const latitude = document.getElementById('lat').value;
    const longitude = document.getElementById('long').value;
    const hashtag = document.getElementById('hashtag').value;

    const newGeoTag  = { name, latitude, longitude, hashtag };
    
    const response = await fetch('/api/geotags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGeoTag )
    });

    if (response.ok) {
        const result = await response.json();
        updateDisplay();                                
    } else {
        console.error('Fehler beim Erstellen des GeoTags');
    }
}

// Function to handle the AJAX request for discovery
async function submitDiscoveryForm(event) {
    event.preventDefault();

    const latitude = document.getElementById('discoveryLatitude').value;
    const longitude = document.getElementById('discoveryLongitude').value;
    const searchterm = document.getElementById('searchterm').value;

    const response = await fetch(`/api/geotags?searchterm=${encodeURIComponent(searchterm)}&latitude=${latitude}&longitude=${longitude}`, {
        method: 'GET'
    });

    if (response.ok) {
        const results = await response.json();
        updateResults(results);                         
    } else {
        console.error('Fehler beim Suchen von GeoTags');
    }
}

// Function to update the display
function updateDisplay() {
    fetch('/api/geotags')
        .then(response => response.json())
        .then(results => updateResults(results))
        .catch(error => console.error('Fehler beim Abrufen der GeoTags:', error));
}

// Function to update the results and map
function updateResults(results) {
    const resultsDiv = document.getElementById('discoveryResults');
    

    // Clear previous results
    resultsDiv.innerHTML = '';
    results.forEach(tag => {
        const tagElement = document.createElement('li');
        tagElement.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`;
        resultsDiv.appendChild(tagElement);
    });

    // Update the map
    // Assuming MapManager is already set up to update the map
    const latitude = parseFloat(document.getElementById('lat').value);
    const longitude = parseFloat(document.getElementById('long').value);
    const mapManager = new MapManager();
    mapManager.initMap(latitude, longitude);
    mapManager.updateMarkers(latitude, longitude, results);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => { 
    updateLocation();

    // Register event listeners for the forms
    document.getElementById('tag-form').addEventListener('button1', submitTaggingForm);
    document.getElementById('discoveryFilterForm').addEventListener('button2', submitDiscoveryForm);    
});

