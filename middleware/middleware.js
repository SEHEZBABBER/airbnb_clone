const express = require('express');
const app = express();
const {listingSchema} = require('../Schema.js');
const {review_Schema} = require('../Schema.js');
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
        throw new ExpressError(401,"Missing argumnets while adding data");
    }
    else{
        next();
    }
}
const validateReview = (req,res,next) => {
    let {error} = review_Schema.validate(req.body);
    if(error){
        throw new ExpressError(401,"Missing arguments while adding data");
    }
    else{
        next();
    }
}
module.exports = {isLoggedin,save_url,validateListing,validateReview};