const express = require('express');
const router = express.Router({mergeParams : true});
const app = express();
const mongoose = require('mongoose');
const list = require('../models/listings.js');
const path = require('path');
const methodOverride = require('method-override');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js');
const {listingSchema} = require('../Schema.js');
const {review_Schema} = require('../Schema.js');
const Joi = require('joi');
const {Review} = require('../models/reviews.js');
const { isLoggedin, save_url } = require('../middleware/middleware.js');
const validateReview = (req,res,next) => {
    let {error} = review_Schema.validate(req.body);
    if(error){
        throw new ExpressError(401,"Missing arguments while adding data");
    }
    else{
        next();
    }
}
// for viewing indvidual properties
router.post('/review',validateReview,save_url,isLoggedin,wrapAsync(async(req,res)=>{
    let review_check = await Review.findOne({author:req.user._id});
    if(review_check){
        throw new ExpressError(401,"You have already reviews this property cant do it again");
    }
    let {id} = req.params;
    let listing = await list.findById(id);
    let {review} = req.body;
    review.author = req.user._id;
    let newReview = await Review.create(review);
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success","review added successfully");
    res.redirect(`/listings/${id}`);
}));
router.delete('/review/:review_id',isLoggedin,wrapAsync(async(req,res)=>{
    let {id,review_id} = req.params;
    let listing = await list.findById(id);
    if(!listing)req.flash("error","review not found");
    let a = listing.reviews.filter((review)=>review.toString() !== review_id.toString());
    if(listing.reviews === a)req.flash("error","review not found");
    else listing.reviews = a;
    await list.updateOne({_id:id},{$set: {reviews : listing.reviews}});
    req.flash("success","review deleted succesully");
    res.redirect(`/listings/${id}`);
}));
module.exports = router;