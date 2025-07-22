import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const store = Joi.object({
    property_id: Joi.number()
        .required(),
    booking_id: Joi.number()
        .required(),
    amount: Joi.number()
        .required(),
    remark: Joi.string()
});

const update = Joi.object({
    booking_id: Joi.number()
        .required(),
    status: Joi.boolean().required()
});

export default { store, update };