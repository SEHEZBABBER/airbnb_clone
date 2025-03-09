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
const {isLoggedin, save_url} = require('../middleware/middleware.js');
router.get('/signup',(req,res)=>{
    res.render("signup");
});
router.post('/signup',wrapAsync(async(req,res,next)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({username,email});
    const registerdUser = await User.register(newUser,password);
    req.flash("success","User Registerd Successfully");
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }
        else{
            req.session.user_id = req.user._id;
            res.redirect('/listings');
        }
    });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
}));
router.get('/login',(req,res)=>{
    res.render("login");
});
router.post('/login',save_url,Passport.authenticate("local", {
    failureRedirect : '/login',
    failureFlash : true,
}),async(req,res)=>{
    req.flash("success","Login Successul");
    req.session.user_id = req.user._id;
    if(!res.locals.redirect_local_url)res.locals.redirect_local_url = '/listings';
    res.redirect(res.locals.redirect_local_url);
});
router.get('/logout',isLoggedin,(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","logout successfull");
            res.redirect('/listings');
        }
    })
});
module.exports = router;