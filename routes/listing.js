const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedin} = require('../middleware/middleware.js');
const {validateListing} = require('../middleware/middleware.js');
const listingController = require('../controllers/listings.js');
// new route
router.get('/new',isLoggedin,listingController.new_route);
// for viewing all the listeings
router.get('/',wrapAsync(listingController.index));
// for adding a new listing
router.post('/',validateListing,isLoggedin,wrapAsync(listingController.post_listing));
// for opening the form of editing
router.get('/edit/:id',isLoggedin,wrapAsync(listingController.open_edit_form));
// for editing the given listing
router.patch('/:id', validateListing , isLoggedin,wrapAsync(listingController.edit_form));
// for deleting listings
router.delete('/:id', isLoggedin, wrapAsync(listingController.delete_list));
//for viewing a property
router.get('/:id', wrapAsync(listingController.view_prop));
module.exports = router;