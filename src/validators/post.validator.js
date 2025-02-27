const Joi = require('joi');

const postSchema = Joi.object({
    user_id: Joi.number().integer().required().messages({
        "number.base": "user_id phải là số",
        "number.integer": "user_id phải là số nguyên",
        "any.required": "user_id là bắt buộc"
    }),
    category_id: Joi.number().integer().required().messages({
        "number.base": "category_id phải là số",
        "number.integer": "category_id phải là số nguyên",
        "any.required": "category_id là bắt buộc"
    }),
    title: Joi.string().min(5).max(100).required().messages({
        "string.base": "title phải là chuỗi",
        "string.min": "title phải có ít nhất 5 ký tự",
        "string.max": "title không được vượt quá 100 ký tự",
        "any.required": "title là bắt buộc"
    }),
    product_name: Joi.string().min(2).max(50).required().messages({
        "string.base": "product_name phải là chuỗi",
        "string.min": "product_name phải có ít nhất 2 ký tự",
        "string.max": "product_name không được vượt quá 50 ký tự",
        "any.required": "product_name là bắt buộc"
    }),
    description: Joi.string().max(500).optional().allow("").messages({
        "string.base": "description phải là chuỗi",
        "string.max": "description không được vượt quá 500 ký tự"
    }),
    price: Joi.number().positive().required().messages({
        "number.base": "price phải là số",
        "number.positive": "price phải lớn hơn 0",
        "any.required": "price là bắt buộc"
    }),
    product_status: Joi.string().valid("Mới", "Đã qua sử dụng", "Mới 99%").required().messages({
        "any.only": "product_status chỉ nhận giá trị 'Mới', 'Đã qua sử dụng' hoặc 'Mới 99%'",
        "any.required": "product_status là bắt buộc"
    }),
    location: Joi.string().required().messages({
        "string.base": "location phải là chuỗi",
        "any.required": "location là bắt buộc"
    })
});

module.exports = postSchema;
