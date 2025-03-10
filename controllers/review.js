const {Review} = require('../models/reviews.js');
const list = require('../models/listings');
const ExpressError = require('../utils/expressError.js');
module.exports.post_review = async(req,res)=>{
    let review_check = await Review.findOne({author:req.user._id});
    if(review_check){
        throw new ExpressError(401,"You have already reviews this property cant do it again");
    }
    let {id} = req.params;
    let listing = await list.findById(id);
    let {review} = req.body;
    review.author = req.user._id;
    let newReview = await Review.create(review);
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success","review added successfully");
    res.redirect(`/listings/${id}`);
}
module.exports.delete_review = async(req,res)=>{
    let {id,review_id} = req.params;
    let listing = await list.findById(id);
    if(!listing)req.flash("error","review not found");
    let a = listing.reviews.filter((review)=>review.toString() !== review_id.toString());
    if(listing.reviews === a)req.flash("error","review not found");
    else listing.reviews = a;
    await list.updateOne({_id:id},{$set: {reviews : listing.reviews}});
    req.flash("success","review deleted succesully");
    res.redirect(`/listings/${id}`);
}