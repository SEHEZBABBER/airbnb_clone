const mongoose = require('mongoose');
const Schema = require('../Schema');
const {Review} = require('./reviews.js');
let listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        type : String,
        default : "https://unsplash.com/photos/a-mountain-range-with-snow-7qJhiyd7yjk",
        set : (V)=> V === ""?"https://unsplash.com/photos/a-mountain-range-with-snow-7qJhiyd7yjk":V,
    },
    price: Number,
    location : String,
    country : String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
        }
    ]
});
listingSchema.post("findOneAndDelete",async (listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})
const List = mongoose.model("List",listingSchema);
module.exports = List;