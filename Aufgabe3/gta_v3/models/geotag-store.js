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
class InMemoryGeoTagStore {

  constructor() {
      this.geoTags = [];
  }
  
  // Methode zum Hinzufügen eines GeoTags
  addGeoTag(geoTag) {
      this.geoTags.push(geoTag);
  }
  
  // Methode zum Entfernen eines GeoTags anhand des Namens
  removeGeoTag(name) {
      this.geoTags = this.geoTags.filter(geoTag => geoTag.name !== name);
  }
  
  // Methode zum Berechnen der Entfernung zwischen zwei Koordinaten
  static calculateDistance(lat1, lon1, lat2, lon2) {
      const toRadians = (degree) => degree * (Math.PI / 180);
      
      const earthRadiusKm = 6371;
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon1 - lon2);  // Korrigiert
      const lat1Rad = toRadians(lat1);
      const lat2Rad = toRadians(lat2);
      
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
      return earthRadiusKm * c;
  }
  
  // Methode zum Abrufen aller GeoTags in der Nähe eines bestimmten Standorts
  getNearbyGeoTags(latitude, longitude, radius) {
      return this.geoTags.filter(geoTag => 
        InMemoryGeoTagStore.calculateDistance(latitude, longitude, geoTag.latitude, geoTag.longitude) <= radius
      );
  }
  
  // Methode zum Suchen von GeoTags in der Nähe eines bestimmten Standorts, die ein bestimmtes Stichwort enthalten
  searchNearbyGeoTags(latitude, longitude, radius, keyword) {
      return this.getNearbyGeoTags(latitude, longitude, radius).filter(geoTag => 
        geoTag.name.includes(keyword) || geoTag.hashtag.includes(keyword)
      );
  }
  
  // Methode zum Laden von Beispieldaten
  loadExampleData() {
      const exampleTags = GeoTagExamples.tagList;
      exampleTags.forEach(([name, latitude, longitude, hashtag]) => {
          this.addGeoTag(new GeoTag(name, latitude, longitude, hashtag));
      });
  }
}

module.exports = InMemoryGeoTagStore;
