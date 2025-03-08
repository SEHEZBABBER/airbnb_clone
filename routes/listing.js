const express = require('express');
const router = express.Router();
const list = require('../models/listings.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js');
const {listingSchema} = require('../Schema.js');
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
    req.flash("success","Data Saved Succesfully");
    res.redirect('/listings');
}));
// for opening the form of editing
router.get('/edit/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let obj = await list.findOne({_id:id});
    if(!obj)req.flash("error","Could Not find the Listing taht you're Lokking For");
    res.render("edit",{obj});
}));
// for editing the given listing
router.patch('/', validateListing ,wrapAsync(async (req, res) => {
    let obj = req.body;
    delete obj.__v;
    await list.updateOne({ _id: obj._id }, { $set: obj });
    req.flash("success","Data edited Successfully");
    res.redirect(`/listings/${obj._id}`);
}));
router.delete('/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await list.findOneAndDelete({_id:id});
    req.flash("success","Data Deleted Successfully");
    res.redirect('/listings');
}));

module.exports = router;