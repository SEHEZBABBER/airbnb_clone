const express = require('express');
const app = express();
const {listingSchema} = require('../Schema.js');
const {reviewSchema} = require('../Schema.js');
const {userSchema} = require('../Schema.js');
const ExpressError = require('../utils/expressError.js');
const addowner = (req,res,next) => {
    if(req.body.price)req.body.price = Number(req.body.price);
    req.body.owner = String(req.user._id);
    return next();
}
const isLoggedin = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.flash("error","you need to login before accessing this page");
        req.session.redirect_local_url = req.originalUrl;
        res.redirect('/login');
    }
};
const save_url = (req,res,next)=>{
    if(req.session.redirect_local_url){
        res.locals.redirect_local_url = req.session.redirect_local_url;
    }
    else{
        res.locals.redirect_local_url = null;
    }
    next();
};
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(401,"missing arguments while adding data");
    }
    else{
        next();
    }
}
const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(401,"Missing arguments while adding data");
    }
    else{
        next();
    }
}

const validateUser = (req,res,next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        throw new Error(error.details[0].message);  // Throw meaningful error message
    }
    return next();  // Return true if validation passes
};
module.exports = {isLoggedin,save_url,validateListing,validateReview,validateUser , addowner};