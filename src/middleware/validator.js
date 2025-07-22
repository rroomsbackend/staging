import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

export var validateBody = (schema) => {
    return (req, res, next) => {
        const result = req.method != 'GET' ? Joi.validate(req.body, schema) : Joi.validate(req.query, schema);
        if (result.error) {
            return res.status(422).json({
                status: 422,
                msg: result.error.details[0].message,
                data: null
            });
        }

        if (!req.value) { req.value = {}; }
        req.value['body'] = result.value;
        next();
    }
}

export var schemas = {
    registerSchema: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    // otpSchema: Joi.object().keys({
    //     firstName: Joi.string().required(),
    //     lastName: Joi.string().optional().allow(null).empty(''),
    //     email: Joi.string().email().required(),
    //     phone: Joi.string().optional().allow(null).empty(''),
    //     domainCode: Joi.string().optional().allow(null).empty(''),
    // }),
    // otpVerfiySchema: Joi.object().keys({
    //     otp: Joi.string().required(),
    //     email: Joi.string().required(),
    //  }),
    loginSchema: Joi.object().keys({
        phone: Joi.string().required(),
        password: Joi.string().required()
    }),
    userCheckSchema: Joi.object().keys({
        phone: Joi.string().required(),

    }),
}