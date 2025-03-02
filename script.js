const express = require('express');
const app = express();
const mongoose = require('mongoose');
const list = require('./models/listings.js');
const path = require('path');
const methodOverride = require('method-override');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/expressError.js');
const listingSchema = require('./Schema.js');
const Joi = require('joi');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded(true));
app.use(express.static(path.join(__dirname, 'public')));
main().then(()=>{
    console.log("Conenction Succesful");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    const MONGO_URL = 'mongodb://127.0.0.1:27017/wander_lust'; 
    await mongoose.connect(MONGO_URL);
}
app.listen(8080,()=>{
    console.log("listening through port 8080");
});
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(401,"Missing argumnets while adding data");
    }
    else{
        next();
    }
}
app.get('/listings/new',(req,res)=>{
    res.render("add");
})
// home root
app.get('/',(req,res)=>{
    res.send("home root working");
});
// for viewing all the listeings
app.get('/listings',wrapAsync(async(req,res)=>{
    const data = await list.find();
    res.render("listings",{data});
}));
// for adding a new listing
app.post('/listings',validateListing,wrapAsync(async(req,res)=>{
    let obj = req.body;
    await list.insertOne(obj);
    res.redirect('/listings');
}));
// for opening the form of editing
app.get('/listings/edit/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let obj = await list.find({_id:id});
    res.render("edit",{obj : obj[0]});
}));
// for editing the given listing
app.patch('/listings', validateListing ,wrapAsync(async (req, res) => {
    let obj = req.body;
    delete obj.__v;
    await list.updateOne({ _id: obj._id }, { $set: obj });
    res.redirect(`/listings/${obj._id}`);
}));
// for deleting a listing
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await list.deleteOne({_id:id});
    res.redirect('/listings');
}));
// for viewing indvidual properties
app.get('/listings/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let obj = await list.find({_id:id});
    res.render("prop_view",{obj : obj[0]});
}));
app.use('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
})
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something went Wrong!"} = err;
    res.status(statusCode)
    res.render("error",{message});
});