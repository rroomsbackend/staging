import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const index = Joi.object({
    property_id: Joi.number()
    .required()
}).unknown(true);

const store = Joi.object({
    property_id: Joi.number()
        .required(),
    name: Joi.string()
        .required(),
    email: Joi.string().optional(),
    phone: Joi.string()
        .required(),
    address: Joi.string()
        .min(2)
        .max(500)
        .required(),
    provider_code: Joi.string().optional(),
    alternate_mobile: Joi.string().optional(),
    pan_number: Joi.string().required(),
    gst: Joi.string().optional(),
    bank_name: Joi.string().required(),
    branch_name: Joi.string().required(),
    account_name: Joi.string().required(),
    account_number: Joi.string().required(),
    ifsc: Joi.string().required()
});

export default { index, store };