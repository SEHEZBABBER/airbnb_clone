const express = require('express');
const router = express.Router();
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
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(401,"Missing argumnets while adding data");
    }
    else{
        next();
    }
}
router.get('/new',(req,res)=>{
    res.render("add");
})
// home root
// for viewing all the listeings
router.get('/',wrapAsync(async(req,res)=>{
    const data = await list.find();
    res.render("listings",{data});
}));
// for adding a new listing
router.post('/',validateListing,wrapAsync(async(req,res)=>{
    let obj = req.body;
    await list.insertOne(obj);
    res.redirect('/listings');
}));
// for opening the form of editing
router.get('/edit/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let obj = await list.find({_id:id});
    res.render("edit",{obj : obj[0]});
}));
// for editing the given listing
router.patch('/', validateListing ,wrapAsync(async (req, res) => {
    let obj = req.body;
    delete obj.__v;
    await list.updateOne({ _id: obj._id }, { $set: obj });
    res.redirect(`/listings/${obj._id}`);
}));

module.exports = router;