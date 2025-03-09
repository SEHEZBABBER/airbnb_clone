const express = require('express');
const router = express.Router();
const list = require('../models/listings.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js');
const {listingSchema} = require('../Schema.js');
const {isLoggedin} = require('../middleware/middleware.js');
const {save_url} = require('../middleware/middleware.js');
const { Review } = require('../models/reviews.js');

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(401,"Missing argumnets while adding data");
    }
    else{
        next();
    }
}
router.get('/new',isLoggedin,(req,res)=>{
    res.render("add");
})
// home root
// for viewing all the listeings
router.get('/',wrapAsync(async(req,res)=>{
    const data = await list.find();
    res.render("listings",{data});
}));
// for adding a new listing
router.post('/',validateListing,isLoggedin,wrapAsync(async(req,res)=>{
    let obj = req.body;
    await list.insertOne(obj);
    req.flash("success","Data Saved Succesfully");
    res.redirect('/listings');
}));
// for opening the form of editing
router.get('/edit/:id',isLoggedin,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let obj = await list.findOne({_id:id});
    if(obj.owner._id != req.session.user_id){
        throw new ExpressError(403,"you are not authroised to edit this page");
    }
    if(!obj)req.flash("error","Could Not find the Listing taht you're Lokking For");
    res.render("edit",{obj});
}));
// for editing the given listing
router.patch('/:id', validateListing , isLoggedin,wrapAsync(async (req, res,next) => {
    let obj = req.body;
    delete obj.__v;
    if(obj.owner._id != req.session.user_id){
        throw new ExpressError(403,"you are not authroised to edit this page");
    }
    await list.updateOne({ _id: obj._id }, { $set: obj });
    req.flash("success","Data edited Successfully");
    res.redirect(`/listings/${obj._id}`);
}));
router.delete('/:id', isLoggedin, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await list.find({_id:id});
    if(listing.owner._id != req.session.user_id){
        throw new ExpressError(403,"you are not authroised to edit this page");
    }
    await list.findOneAndDelete({_id:id});
    req.flash("success","Data Deleted Successfully");
    res.redirect('/listings');
}));
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let obj = await list.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    res.locals.user_id = req.session.user_id;  // Store user_id in locals

    // Ensure user_id is defined before querying
    let my_review = null;
    if (req.session.user_id) {
        my_review = await Review.findOne({ author: req.session.user_id });
    }

    res.render("prop_view", { obj, review: my_review });
}));
module.exports = router;