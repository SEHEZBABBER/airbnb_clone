const Joi = require('joi');

let listingSchema = Joi.object({
    _id:Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().required(),  // Fixed missing parentheses
    location: Joi.string().required(),  // Fixed missing parentheses
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),  // Order of min and required doesn't matter
    image: Joi.string().allow("", null)  // This is fine
});
let reviewSchema = Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5),
    }).required()
});
module.exports = {
    listingSchema:listingSchema,
    review_Schema:reviewSchema,
}