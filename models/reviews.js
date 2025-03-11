const { number } = require('joi');
const mongoose = require('mongoose');
const {User} = require('./User.js');
let reviewSchema = mongoose.Schema({
    comment:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        min : 1,
        max : 5,
    },
    createdAt :{
        type : Date,
        default : Date.now(),
    },
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
});
const Review = mongoose.model("Review",reviewSchema);
module.exports = {Review};