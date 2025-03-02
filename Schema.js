const Joi = require('joi');

module.exports = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),  // Fixed missing parentheses
    location: Joi.string().required(),  // Fixed missing parentheses
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),  // Order of min and required doesn't matter
    image: Joi.string().allow("", null)  // This is fine
});
