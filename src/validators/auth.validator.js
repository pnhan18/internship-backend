const Joi = require('joi');

const loginSchema = Joi.object({
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
            'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
            'any.required': 'Mật khẩu là bắt buộc'
        })
});
const changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .messages({
            'any.required': 'Mật khẩu cũ là bắt buộc'
        }),
    newPassword: Joi.string()
        .min(6)
        .max(30)
        .required()
        .disallow(Joi.ref('oldPassword')) // Không cho phép mật khẩu mới trùng với mật khẩu cũ
        .messages({
            'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
            'string.max': 'Mật khẩu mới không được vượt quá 30 ký tự',
            'any.required': 'Mật khẩu mới là bắt buộc',
            'any.invalid': 'Mật khẩu mới không được trùng với mật khẩu cũ'
        })
});

module.exports = { loginSchema ,changePasswordSchema};