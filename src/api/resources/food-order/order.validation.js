import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

let items = Joi.object().keys({
    id: Joi.number().required(),
    qty: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.any().optional(),
    amountBeforeTax: Joi.any().optional(),
    taxAmount: Joi.any().optional(),
    propertyId: Joi.any().optional(),
    totalAmount: Joi.any().optional()
});

const store = Joi.object({
    user_id: Joi.number()
        .required(),
    booking_id: Joi.number()
        .optional(),
    room_number: Joi.string()
        .optional(),
    order_amount: Joi.number()
        .required(),
    order_items: Joi.array()
        .items(items)
        .required(),
    created_by: Joi.number().optional(),
    nc_type: Joi.number().optional()
}).unknown(true);
const updateStatus = Joi.object({
    payment_status: Joi.number(),
    order_status: Joi.number()
});

export default { store, updateStatus };