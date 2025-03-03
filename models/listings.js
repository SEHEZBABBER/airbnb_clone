const mongoose = require('mongoose');
const Schema = require('../Schema');
let listingScheam = new mongoose.Schema({
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
const List = mongoose.model("List",listingScheam);
module.exports = List;