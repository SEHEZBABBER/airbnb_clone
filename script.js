const express = require('express');
const app = express();
const mongoose = require('mongoose');
const list = require('./models/listings.js');
const path = require('path');
const methodOverride = require('method-override');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/expressError.js');
const {listingSchema} = require('./Schema.js');
const {review_Schema} = require('./Schema.js');
const Joi = require('joi');
const {Review} = require('./models/reviews.js');
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
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

app.use('/listings',listings);
app.use('/listings/:id',reviews);
// for deleting a listing

app.use('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
})
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something went Wrong!"} = err;
    res.status(statusCode)
    res.render("error",{message,err});
});