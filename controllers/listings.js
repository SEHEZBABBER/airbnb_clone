const list = require("../models/listings");
const ExpressError = require("../utils/expressError.js");
const { Review } = require("../models/reviews.js");
module.exports.new_route = async (req, res) => {
  res.render("add");
};
module.exports.index = async (req, res) => {
  try {
    let searchQuery = req.query.search;
    let filter = {};

    if (searchQuery) {
      filter = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for title
          { location: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for location
          { country: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for country
        ],
      };
    }
    const data = await list.find(filter);
    res.render("listings", { data, searchQuery }); // Pass searchQuery to keep input filled
  } catch (error) {
    throw new ExpressError(500, "Service Error");
  }
};
module.exports.post_listing = async (req, res) => {
  let obj = req.body;
  obj.image.URL = req.file.path;
  obj.image.path = req.file.filename;
  console.log(obj);
  await list.insertOne(obj);
  req.flash("success", "Data Saved Succesfully");
  res.redirect("/listings");
};
module.exports.open_edit_form = async (req, res) => {
  let { id } = req.params;
  let obj = await list.findOne({ _id: id });
  if (obj.owner._id != req.session.user_id) {
    throw new ExpressError(403, "you are not authroised to edit this page");
  }
  if (!obj)
    req.flash("error", "Could Not find the Listing taht you're Lokking For");
  res.render("edit", { obj });
};
module.exports.edit_form = async (req, res, next) => {
  let obj = req.body;
  delete obj.__v;
  // console.log(req.file);
  if (obj.owner != req.session.user_id) {
    throw new ExpressError(403, "you are not authroised to edit this page");
  }
  if (req.file.filename && req.file.path) {
    obj.image = {
      URL: req.file.path,
      path: req.file.filename,
    };
  }
  console.log(obj);
  await list.updateOne({ _id: obj._id }, { $set: obj });
  req.flash("success", "Data edited Successfully");
  res.redirect(`/listings/${obj._id}`);
};
module.exports.delete_list = async (req, res) => {
  let { id } = req.params;
  let listing = await list.findOne({ _id: id });
  if (listing.owner._id != req.session.user_id) {
    throw new ExpressError(403, "you are not authroised to edit this page");
  }
  await list.findOneAndDelete({ _id: id });
  req.flash("success", "Data Deleted Successfully");
  res.redirect("/listings");
};
module.exports.view_prop = async (req, res) => {
  let { id } = req.params;
  let obj = await list
    .findById(id)
    .populate({ path: "reviews", populate: { path: "owner" } })
    .populate("owner");

  res.locals.user_id = req.session.user_id; // Store user_id in locals

  // Ensure user_id is defined before querying
  let my_review = null;
  if (req.session.user_id) {
    my_review = await Review.findOne({ owner: req.session.user_id });
  }

  res.render("prop_view", { obj, review: my_review });
};
