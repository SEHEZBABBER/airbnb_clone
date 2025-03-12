const mongoose = require('mongoose');
const Schema = require('../Schema');
const {Review} = require('./reviews.js');
const {User} = require('./User.js');
let listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        path:String,
        URL:String,
    },
    price: Number,
    location : String,
    country : String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});
listingSchema.post("findOneAndDelete",async (listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})
const List = mongoose.model("List",listingSchema);
module.exports = List;