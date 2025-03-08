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
const User = require('../models/User.js');
const Passport = require('passport');
router.get('/signup',(req,res)=>{
    res.render("signup");
});
router.post('/signup',wrapAsync(async(req,res)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({username,email});
    await User.register(newUser,password);
    req.flash("success","User Registerd Successfully");
    res.redirect('/listings');
    }
    catch(e){
        req.flash("error",e.message);
    }
}));
router.get('/login',(req,res)=>{
    res.render("login");
});
router.post('/login',Passport.authenticate("local", {
    failureRedirect : '/login',
    failureFlash : true,
}),async(req,res)=>{
    req.flash("success","Login Successul");
    res.redirect('./listings');
});
module.exports = router;