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
router.get('/',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let obj = await list.find({_id:id}).populate("reviews");
    res.render("prop_view",{obj : obj[0]});
}));
router.post('/review',validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await list.findById(id);
    let {review} = req.body;
    console.log(Review);
    let newReview = await Review.create(review);
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success","review added successfully");
    res.redirect(`/listings/${id}`);
}));
router.delete('/review/:review_id',wrapAsync(async(req,res)=>{
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