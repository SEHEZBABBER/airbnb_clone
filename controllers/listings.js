const list = require('../models/listings');
const ExpressError = require('../utils/expressError.js');
const { Review } = require('../models/reviews.js');
module.exports.new_route = async(req,res)=>{
    res.render("add");
}
module.exports.index = async(req,res)=>{
    const data = await list.find();
    res.render("listings",{data});
}
module.exports.post_listing = async(req,res)=>{
    let obj = req.body;
    obj.owner = req.user._id;
    await list.insertOne(obj);
    req.flash("success","Data Saved Succesfully");
    res.redirect('/listings');
};
module.exports.open_edit_form = async(req,res)=>{
    let {id} = req.params;
    let obj = await list.findOne({_id:id});
    if(obj.owner._id != req.session.user_id){
        throw new ExpressError(403,"you are not authroised to edit this page");
    }
    if(!obj)req.flash("error","Could Not find the Listing taht you're Lokking For");
    res.render("edit",{obj});
};
module.exports.edit_form = async (req, res,next) => {
    let obj = req.body;
    delete obj.__v;
    if(obj.owner != req.session.user_id){
        throw new ExpressError(403,"you are not authroised to edit this page");
    }
    await list.updateOne({ _id: obj._id }, { $set: obj });
    req.flash("success","Data edited Successfully");
    res.redirect(`/listings/${obj._id}`);
};
module.exports.delete_list = async(req,res)=>{
    let {id} = req.params;
    let listing = await list.findOne({_id:id});
    console.log(listing);
    if(listing.owner._id != req.session.user_id){
        throw new ExpressError(403,"you are not authroised to edit this page");
    }
    await list.findOneAndDelete({_id:id});
    req.flash("success","Data Deleted Successfully");
    res.redirect('/listings');
};
module.exports.view_prop = async (req, res) => {
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
};