const { BadRequestError } = require('../core/error.response');

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(err => err.message);
            next(new BadRequestError(errors));
        }
        next();
    };
};

module.exports = validate;