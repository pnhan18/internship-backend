const Joi = require('joi');

const messageSchema = Joi.object({
    type: Joi.string(),
    receiverId: Joi.number().integer().positive().required(),
    postId: Joi.number().integer().positive(),
    content: Joi.string().trim().min(1).max(1000).required(),
});

module.exports = {
    validateMessage: (data) => messageSchema.validate(data, { abortEarly: false })
};