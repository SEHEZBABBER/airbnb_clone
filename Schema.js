const Joi = require('joi');

const listingSchema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow("", null),
    owner: Joi.string().required(),  // Owner ID must be provided
});

const reviewSchema = Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    owner: Joi.string().required(),  
});
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email(),
    password: Joi.string().min(6).required(),
});
module.exports = {
    listingSchema,
    reviewSchema,
    userSchema,
};
