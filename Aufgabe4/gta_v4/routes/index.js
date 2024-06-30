const express = require('express');
const router = express.Router();
const GeoTag = require('../models/geotag');
const InMemoryGeoTagStore = require('../models/geotag-store');
let storedTags = [];
const store = new InMemoryGeoTagStore();
store.populateWithExamples();


const ITEMS_PER_PAGE = 5;
let searchTermsStore = [""];



router.get('/', (req, res) => {
  const { latitude, longitude, page } = req.query;

  let searchterm = req.query.searchterm;
  let results = store.getGeoTags();
  if (searchterm==undefined) {
    searchterm = "";
    results = store.searchGeoTags(searchterm);
  } else if (latitude && longitude) {

    results = store.getNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), 100); // Adjust radius as needed 
    results = store.getNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), 100); // Adjust radius as neededfg

  }

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  let currentPage = parseInt(page, 10) || 1;

  // Ensure currentPage is within valid range
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = results.slice(start, start + ITEMS_PER_PAGE);

  res.render('index', {
    taglist: paginatedResults,
    latitude: latitude || null,
    longitude: longitude || null,
    searchterm: searchterm || '',
    currentPage: currentPage,
    totalPages: totalPages,
    totalItems: totalItems
  });
});

router.post('/tagging', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
  store.addGeoTag(newGeoTag);

  const nearbyTags = store.getNearbyGeoTags(newGeoTag.latitude, newGeoTag.longitude, 100); // Adjust radius as needed
  const totalItems = nearbyTags.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentPage = parseInt(req.query.page) || 1;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = nearbyTags.slice(start, start + ITEMS_PER_PAGE);
  
  res.render('index', {
    taglist: paginatedResults,
    latitude: latitude,
    longitude: longitude,
    currentPage: currentPage,
    totalPages: totalPages,
    totalItems: totalItems
  });

  res.redirect('/discovery');
});

router.post('/discovery', (req, res) => {
  let { latitude, longitude, searchterm } = req.body;
  
  let results;
  if (searchterm!==undefined) {
    results = store.searchNearbyGeoTags(searchterm, latitude, longitude, 100);
    searchTermsStore.push(longitude);
    searchTermsStore.push(latitude);
    searchTermsStore.push(searchterm);
    
  } else {
    searchterm = undefined;
    results = store.getGeoTags();
    
  }

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  let currentPage = parseInt(req.query.page) || 1;
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  let start = (currentPage - 1) * ITEMS_PER_PAGE;
  let paginatedResults = results.slice(start, start + ITEMS_PER_PAGE);

  res.render('index', {
    taglist: paginatedResults,
    latitude: latitude,
    longitude: longitude,
    currentPage: currentPage,
    totalPages: totalPages,
    totalItems: totalItems
  });
});

router.get('/discovery', (req, res) => {
  let { latitude, longitude ,searchterm} = req.query;
  let results;
  
  console.log(searchterm);
  if (searchterm!=="") {
  searchterm = searchTermsStore[searchTermsStore.length - 1];
  results = store.searchNearbyGeoTags(searchTermsStore[searchTermsStore.length -1], searchTermsStore[searchTermsStore.length -2], searchTermsStore[searchTermsStore.length -3], 100);
}

  else{
  results = store.getGeoTags();
  }
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  let currentPage = parseInt(req.query.page) || 1;

  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  let start = (currentPage - 1) * ITEMS_PER_PAGE;
  let paginatedResults = results.slice(start, start + ITEMS_PER_PAGE);

  res.render('index', {
    taglist: paginatedResults,
    latitude: latitude || null,
    longitude: longitude || null,
    currentPage: currentPage,
    totalPages: totalPages,
    totalItems: totalItems
  });
});

router.get('/api/geotags', (req, res) => {
  const { latitude, longitude, searchTerm } = req.query;
  let results;
  if (searchTerm) {
    results = store.searchGeoTags(searchTerm);
  } else if (latitude && longitude) {
    results = store.getNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), 100); // Adjust radius as needed
  } else {
    results = store.getGeoTags();
  }
  res.json(results);
});

router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
  store.addGeoTag(newGeoTag);
  res.status(201).json(newGeoTag);
});

router.get('/api/geotags/:id', (req, res) => {
  const id = req.params.id;
  const tag = store.getGeoTagById(id);
  if (tag) {
    res.json(tag);
  } else {
    res.status(404).send('GeoTag not found');
  }
});

router.put('/api/geotags/:id', (req, res) => {
  const id = req.params.id;
  const { name, latitude, longitude, hashtag } = req.body;
  const updatedGeoTag = new GeoTag(name, latitude, longitude, hashtag, id);
  const result = store.updateGeoTag(id, updatedGeoTag);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('GeoTag not found');
  }
});

router.delete('/api/geotags/:id', (req, res) => {
  const id = req.params.id;
  const result = store.removeid(id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('GeoTag not found');
  }
});

module.exports = router;
