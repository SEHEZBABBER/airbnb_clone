const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedin} = require('../middleware/middleware.js');
const {validateListing} = require('../middleware/middleware.js');
const {addowner,addimage} = require('../middleware/middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer');
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage })
// new route
router.get('/new',isLoggedin,listingController.new_route);
// for viewing all the listeings
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedin,upload.single('image'),addowner,addimage,validateListing,wrapAsync(listingController.post_listing));
// for opening the form of editing
router.get('/edit/:id',isLoggedin,wrapAsync(listingController.open_edit_form));
// for editing the given listing
router.route('/:id')
    .patch(isLoggedin,upload.single('image'),validateListing,wrapAsync(listingController.edit_form))
    .delete(isLoggedin, wrapAsync(listingController.delete_list))
    .get(wrapAsync(listingController.view_prop));


module.exports = router;