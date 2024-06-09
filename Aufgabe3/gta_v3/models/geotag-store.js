// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
const GeoTag = require('../models/geotag');
const GeoTagExamples = require('../models/geotag-examples');
class InMemoryGeoTagStore{

    #geoTags = [];  // Private Array zur Speicherung der GeoTags

    /**
     * Add a GeoTag to the store.
     * @param {GeoTag} geoTag - The GeoTag object to add.
     */
    // Methode zum Hinzufügen eines GeoTags
    addGeoTag(geoTag) {
      this.#geoTags.push(geoTag);
    }
    
    getGeoTags() {
      return this.#geoTags.slice();
  }

    /**
     * Remove a GeoTag from the store by name.
     * @param {string} name - The name of the GeoTag to remove.
     */
    // Methode zum Entfernen eines GeoTags nach Namen
    removeGeoTag(name) {
      this.#geoTags = this.#geoTags.filter(tag => tag.name !== name);
    }
    
        /**
     * Get all GeoTags in the proximity of a location.
     * @param {number} latitude - The latitude of the location.
     * @param {number} longitude - The longitude of the location.
     * @param {number} radius - The radius around the location to search for GeoTags.
     * @returns {GeoTag[]} - Array of GeoTags in the proximity.
    */
    // Methode zum Abrufen von GeoTags in der Nähe eines gegebenen Punktes
    getNearbyGeoTags(latitude, longitude, radius) {
      return this.#geoTags.filter(tag => {
        const distance = this.#calculateDistance(latitude, longitude, tag.latitude, tag.longitude);
        return distance <= radius;
      });
    }
  

  /**
  * Search for GeoTags in the proximity of a location that match a keyword.
  * @param {string} keyword - The keyword to search for.
  * @param {number} latitude - The latitude of the location.
  * @param {number} longitude - The longitude of the location.
  * @param {number} radius - The radius around the location to search for GeoTags.
  * @returns {GeoTag[]} - Array of GeoTags in the proximity matching the keyword.
  */
  // Methode zum Suchen von GeoTags in der Nähe eines gegebenen Punktes nach einem Suchbegriff
  searchNearbyGeoTags(keyword, latitude, longitude, radius) {
        const caseKeyword = keyword.toLowerCase();
        return this.#geoTags.filter(tag => {
            const distance = this.#calculateDistance(latitude, longitude, tag.latitude, tag.longitude);
            const casename = tag.name.toLowerCase();
          const casehashtag = tag.hashtag.toLowerCase();
            
          return distance <= radius &&  (casename.includes(caseKeyword) || casehashtag.includes(caseKeyword)) ;
            
        });
    }

    /**
   * Befüllt den Speicher mit Beispieldaten aus GeoTagExamples
   */
  populateWithExamples() {
    GeoTagExamples.tagList.forEach(tag => {
      this.addGeoTag({
        name: tag[0],
        latitude: tag[1],
        longitude: tag[2],
        hashtag: tag[3]
      });
    });
  }

  
    // Private Methode zur Berechnung der Entfernung zwischen zwei Punkten (Haversine-Formel)
    #calculateDistance(lat1, lon1, lat2, lon2) {
      const toRad = (value) => value * Math.PI / 180;
      const R = 6371; // Radius der Erde in Kilometern
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }
}
  



module.exports = InMemoryGeoTagStore