// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

function updateLocation() {
    
     // Selektieren Sie die Formularfelder für die Koordinaten im DOM
     const latitudeField = document.getElementById('lat');
     const longitudeField = document.getElementById('long');
     
     // Überprüfen Sie, ob die Koordinatenfelder bereits Werte enthalten
    latitude = latitudeField.value;
    longitude = longitudeField.value;
     
     // Falls die Felder leer sind, rufen Sie die Methode LocationHelper.findLocation() auf
    if (!latitude || !longitude) {
        LocationHelper.findLocation((location) => {
        
        // gibt die Koordinaten aus breite und länge 
        latitude = location.latitude; // breite 
        longitude = location.longitude; // länge 

        // Koordinaten in die Formulare eintragen
        latitudeField.value = latitude;
        longitudeField.value = longitude;
        document.getElementById('discoveryLatitude').value = latitude; // Versteckte Eingabefelder berücksichtigen
        document.getElementById('discoveryLongitude').value = longitude; // Versteckte Eingabefelder berücksichtigen
    
        
    });
     }
    
    // Initialize map and update markers
    mapManager = new MapManager();
    mapManager.initMap(latitude,longitude);
    mapManager.updateMarkers(latitude,longitude);


    

    // Find the <img> element by its id and remove it
    mapViewImg = document.getElementById('mapView');
    mapViewImg.remove();
        

    // Find the <p> element by its parent and remove it
    mapViewSpan = document.querySelector('.discovery__map span');
    mapViewSpan.remove();
    
    
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => { 
    updateLocation(),
    alert("Please change the script 'geotagging.js'");
});