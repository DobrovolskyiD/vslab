// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

  // TODO: ... your code here ...
    
  /**
   * Constructs a new GeoTag object.
   * 
   * @param {string} name - The name of the geotag.
   * @param {number} latitude - The latitude of the geotag.
   * @param {number} longitude - The longitude of the geotag.
   * @param {string} hashtag - The hashtag associated with the geotag.
  */

  constructor(name, latitude, longitude, hashtag) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.hashtag = hashtag;
  }

}

module.exports = GeoTag;
