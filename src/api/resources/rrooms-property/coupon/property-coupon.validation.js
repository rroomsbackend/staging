import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const index = Joi.object({
    property_id: Joi.number()
    .required()
}).unknown(true);

const store = Joi.object({
    property_id: Joi.number(),
    title: Joi.string()
    .required(),
    code: Joi.string()
    .required(),
    amount: Joi.number()
        .min(1)
        .max(100)
        .required(),
    expireAt: Joi.date().format('YYYY-MM-DD').required(),
    status: Joi.number().required(),
    offerMode: Joi.number(),
    allowChange: Joi.number(),
    updatedPrice: Joi.string(),
    start_at: Joi.date().format('YYYY-MM-DD').required(),
    booking_from: Joi.date().format('YYYY-MM-DD').required(),
    booking_to: Joi.date().format('YYYY-MM-DD').required(),
    isOneTimePerUser: Joi.number().optional(),
});

export default { index, store };