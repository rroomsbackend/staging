import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const store = Joi.object({
    first_name: Joi.string()
        .required(),
    last_name: Joi.string()
        .required(),
    email: Joi.string()
        .email()
        .required(),
    mobile: Joi.string()
        .required(),
    property_name: Joi.string()
        .required(),
    address_line_1: Joi.string()
        .min(2)
        .max(500)
        .required(),
    address_line_2: Joi.string()
        .max(500),
    state_id: Joi.string()
        .required(),
    city: Joi.string()
        .required(),
    pincode: Joi.number()
        .required()
});

const remark = Joi.object({
    remark: Joi.string()
        .required()
});

const assign = Joi.object({
    assign_to: Joi.number()
        .required()
});

export default { store, remark, assign };