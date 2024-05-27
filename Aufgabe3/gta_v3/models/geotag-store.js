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

const GeoTag = require('./geotag');
const GeoTagExamples = require('./geotag-examples');

class InMemoryGeoTagStore {

    constructor() {
        this.geotags = [];
    }

    /**
     * Adds a GeoTag to the store.
     * @param {GeoTag} geoTag - The GeoTag to add.
    */
   
    addGeoTag(geoTag) {
        this.geotags.push(geoTag);
    }
/*
    /**
     * Removes GeoTags from the store by name.
     * @param {string} name - The name of the GeoTag to remove.
    */
/*  
    removeGeoTag(name) {
        this.geotags = this.geotags.filter(geoTag => geoTag.name !== name);
    }
    */
    /**
     * Returns all GeoTags in the proximity of a location.
     * @param {number} latitude - The latitude of the location.
     * @param {number} longitude - The longitude of the location.
     * @param {number} radius - The radius around the location.
     * @returns {GeoTag[]} - The list of GeoTags within the radius.
    */

    getNearbyGeoTags(latitude, longitude, radius) {
        return this.geotags.filter(geoTag => this._isWithinRadius(geoTag, latitude, longitude, radius));
    }

    /**
     * Returns all GeoTags in the proximity of a location that match a keyword.
     * @param {number} latitude - The latitude of the location.
     * @param {number} longitude - The longitude of the location.
     * @param {number} radius - The radius around the location.
     * @param {string} keyword - The keyword to match.
     * @returns {GeoTag[]} - The list of matching GeoTags within the radius.
    */

    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        return this.geotags.filter(geoTag => 
            this._isWithinRadius(geoTag, latitude, longitude, radius) &&
            (geoTag.name.includes(keyword) || geoTag.hashtag.includes(keyword))
        );
    }

    /**
     * Checks if a GeoTag is within a given radius of a location.
     * @private
     * @param {GeoTag} geoTag - The GeoTag to check.
     * @param {number} latitude - The latitude of the location.
     * @param {number} longitude - The longitude of the location.
     * @param {number} radius - The radius around the location.
     * @returns {boolean} - True if the GeoTag is within the radius, false otherwise.
    */

    _isWithinRadius(geoTag, latitude, longitude, radius) {
        const toRad = value => value * Math.PI / 180;
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(geoTag.latitude - latitude);
        const dLon = toRad(geoTag.longitude - longitude);
        const lat1 = toRad(latitude);
        const lat2 = toRad(geoTag.latitude);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in kilometers
        return distance <= radius;
    }

    /**
     * Loads example data into the store.
     */
    loadExampleData() {
        const exampleTags = GeoTagExamples.tagList;
        exampleTags.forEach(([name, latitude, longitude, hashtag]) => {
            this.addGeoTag(new GeoTag(name, latitude, longitude, hashtag));
        });
    }
}

module.exports = InMemoryGeoTagStore;
