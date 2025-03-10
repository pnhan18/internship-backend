const Joi = require('joi');

const reviewSchema = Joi.object({
    sellerId: Joi.number().required(),
    reviewerId: Joi.number().integer().required(),
    content: Joi.string().min(1).max(1000).required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    reviewTitle: Joi.string().min(1).max(255).required(),
});

module.exports = { reviewSchema };