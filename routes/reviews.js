const express = require('express');
const router = express.Router({mergeParams : true});
const list = require('../models/listings.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedin, save_url , validateReview } = require('../middleware/middleware.js');
const reviewController = require('../controllers/review.js');

// for adding a review
router.post('/review',validateReview,save_url,isLoggedin,wrapAsync(reviewController.post_review));
// for deleting review
router.delete('/review/:review_id',isLoggedin,wrapAsync(reviewController.delete_review));

module.exports = router;