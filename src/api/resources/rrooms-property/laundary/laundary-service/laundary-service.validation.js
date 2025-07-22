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
    price: Joi.number()
        .required(),
    providerId: Joi.number()
});

export default { index, store };