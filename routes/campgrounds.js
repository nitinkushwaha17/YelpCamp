const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.get('/', catchAsync(campgrounds.index));

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id', catchAsync(campgrounds.showCampground));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;