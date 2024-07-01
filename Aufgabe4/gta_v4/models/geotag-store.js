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
  #currentId = 1;

  /**
   * Add a GeoTag to the store.
   * @param {GeoTag} geoTag - The GeoTag object to add.
  */
  addGeoTag(geoTag) {
    geoTag.id = this.#currentId++;
    this.#geoTags.push(geoTag);
  }
  
  // Aufgabe 4

  /**
   * Get a GeoTag from the store by ID.
   * @param {number} id - The ID of the GeoTag to retrieve.
   * @returns {Object|null} The GeoTag object if found, otherwise null.
  */
  getGeoTagById(id) {
    return this.#geoTags.find(tag => tag.id === parseInt(id));
  }


  /**
   * Update a GeoTag in the store.
   * @param {number} id - The ID of the GeoTag to update.
   * @param {Object} newGeoTag - The new GeoTag data to update.
   * @returns {Object|null} The updated GeoTag object if found, otherwise null.
  */
  updateGeoTag(id, newGeoTag) {
    const index = this.#geoTags.findIndex(tag => tag.id === parseInt(id));
    if (index !== -1) {
      this.#geoTags[index] = { ...this.#geoTags[index], ...newGeoTag };
      return this.#geoTags[index];
    }
    return null;
  }


  /**
   * Delete a GeoTag from the store by ID.
   * @param {number} id - The ID of the GeoTag to delete.
   * @returns {Object|null} The deleted GeoTag object if found, otherwise null.
  */
  removeid(id) {
    const index = this.#geoTags.findIndex(tag => tag.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.#geoTags.splice(index, 1);
      return deleted[0];
    }
    return null;
  }



  /**
   * Search for GeoTags in the store.
   * @param {string} searchTerm - The search filter to apply.
   * @returns {Object[]} A list of GeoTags that match the filter.
   */
  searchGeoTags(searchTerm) {
    return this.#geoTags.filter(tag => 
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      tag.hashtag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  
  // Ende der Aufgabe 4


  getGeoTags() {
    return this.#geoTags.slice();
  }


  /**
   * Remove a GeoTag from the store by name.
   * @param {string} name - The name of the GeoTag to remove.
   */
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