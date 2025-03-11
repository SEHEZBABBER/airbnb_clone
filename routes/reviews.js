const express = require('express');
const router = express.Router({mergeParams : true});
const list = require('../models/listings.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedin, save_url , validateReview ,addowner } = require('../middleware/middleware.js');
const reviewController = require('../controllers/review.js');

// for adding a review
router.post('/review',isLoggedin,addowner,validateReview,save_url,wrapAsync(reviewController.post_review));
// for deleting review
router.delete('/review/:review_id',isLoggedin,wrapAsync(reviewController.delete_review));

module.exports = router;