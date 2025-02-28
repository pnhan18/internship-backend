const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
            'string.email': 'Email không hợp lệ',
            'any.required': 'Email là bắt buộc'
        }),

    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            'string.max': 'Mật khẩu không được quá 30 ký tự',
            'any.required': 'Mật khẩu là bắt buộc'
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10,11}$/)
        .required()
        .messages({
            'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
        }),
});

module.exports = { userSchema };