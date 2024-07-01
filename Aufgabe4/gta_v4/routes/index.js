
// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const InMemoryGeoTagStore = require('../models/geotag-store');
const { path } = require('../app');

// App routes (A3)

const store = new InMemoryGeoTagStore();

// Load example GeoTags into the store
store.populateWithExamples(); // Call this method to load example GeoTags into the store
//const tags = store.getGeoTags(); // Holen Sie sich alle GeoTags



/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {

  res.render('index', { taglist: [],
                      latitude: null  ,
                      longitude : null,
                      currentPage : 0,
                      totalPages : 0,
                      totalTags : 0 ,
                      searchterm:  ""
                    })
});


/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post('/tagging', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag); 
  store.addGeoTag(newGeoTag);
  const nearbyTags = store.getNearbyGeoTags(newGeoTag.latitude, newGeoTag.longitude, 100); // Adjust radius as needed
  
  
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
  const perPage = 5; // Number of tags per page
  const totalPages = Math.ceil(nearbyTags.length / perPage);
  const paginatedTags = nearbyTags.slice((page - 1) * perPage, page * perPage);
  
  res.render('index', { 
    taglist: paginatedTags,
    latitude: latitude  ,
    longitude : longitude,
    currentPage : page,
    totalPages : totalPages,
    totalTags : nearbyTags.length, 
    searchterm: "" 
  });
});


/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

let searchTermsStore = [];
router.post('/discovery', (req, res) => {
  const { latitude, longitude, searchterm } = req.body;
  let results;
  if (searchterm) {
    results = store.searchNearbyGeoTags(searchterm, latitude, longitude, 100); // Adjust radius as needed
  } else {
    results = store.getNearbyGeoTags(latitude, longitude, 100); // Adjust radius as needed
  }
  
  
  
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
  const perPage = 5; // Number of tags per page
  const totalPages = Math.ceil(results.length / perPage);
  const paginatedTags = results.slice((page - 1) * perPage, page * perPage);
  
  res.render('index', { 
    taglist: paginatedTags,
    latitude: latitude  ,
    longitude : longitude,
    currentPage : page,
    totalPages : totalPages,
    totalTags : results.length,
    searchterm: searchterm 
    });
});




// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags', (req, res) => {
  const { latitude, longitude, searchterm } = req.query;
  let results = [];
  if (searchterm) {
    results = store.searchGeoTags(searchterm);
  } else if (latitude && longitude) {
    results = store.getNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), 100); // Adjust radius as needed
  } else {
    results = store.getGeoTags();
  }

  const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
  const perPage = 5; // Number of tags per page
  const totalPages = Math.ceil(results.length / perPage);
  const paginatedTags = results.slice((page - 1) * perPage, page * perPage);
  
  res.json({ 
    taglist: paginatedTags,
    currentPage : page,
    totalPages : totalPages,
    totalTags : results.length });


});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
  store.addGeoTag(newGeoTag);
  res.status(201).json(newGeoTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', (req, res) => {
  const id = req.params.id;
  const tag = store.getGeoTagById(id);
  if (tag) {
    res.json(tag);
  } else {
    res.status(404).send('GeoTag not found get');
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
  const id = req.params.id;
  const { name, latitude, longitude, hashtag } = req.body;
  const updatedGeoTag = new GeoTag(name, latitude, longitude, hashtag, id);
  const result = store.updateGeoTag(id, updatedGeoTag);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('GeoTag not found put');
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req, res) => {
  const id = req.params.id;
  const result = store.removeid(id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('GeoTag not found del');
  }
});



module.exports = router;
