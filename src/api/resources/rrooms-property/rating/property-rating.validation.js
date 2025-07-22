import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const index = Joi.object({
    property_id: Joi.number()
    .optional(),
    bookingCode: Joi.string()
    .optional(),
});

const store = Joi.object({
    user_id: Joi.number()
        .required(),
    property_id: Joi.number()
        .required(),
    ratings: Joi.number()
        .min(1)
        .max(5)
        .required(),
    reviews: Joi.string()
        .required(),
    bookingCode: Joi.string()
        .required(),
    fromDate: Joi.string()
        .required(),
    toDate: Joi.string()
        .required(),
});

export default { index, store };