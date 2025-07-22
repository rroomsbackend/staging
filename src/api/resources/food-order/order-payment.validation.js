import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const store = Joi.object({
    booking_id: Joi.number()
        .optional(),
    order_id: Joi.number()
        .optional(),
    property_id: Joi.number()
        .required(),
    payment_amount: Joi.number()
        .required(),
    payment_mode: Joi.number()
        .required(),
    transactionId: Joi.string()
        .optional(),
    orderAmount: Joi.number()
        .required()
});

export default { store };