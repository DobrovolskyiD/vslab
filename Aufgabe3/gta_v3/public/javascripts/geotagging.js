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

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => { 
    updateLocation();
    alert("Please change the script 'geotagging.js'");
});
