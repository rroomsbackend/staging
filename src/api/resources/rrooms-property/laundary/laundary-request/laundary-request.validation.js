import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const store = Joi.object({
    property_id: Joi.number()
        .required(),
    provider_id: Joi.number()
        .required(),
    service: Joi.array()
        .items({
            service_id: Joi.number()
                .required(),
            quantity: Joi.number()
                .required(),
            total_service_amount: Joi.number()
                .required(),

        }).min(1).required()
}).unknown(true);

const update = Joi.object({
    property_id: Joi.number()
        .required(),
    service_id: Joi.number()
        .required(),
    provider_id: Joi.number()
        .required(),
    quantity: Joi.number()
        .required(),
    total_service_amount: Joi.number()
        .required()
}).unknown(true);

export default { store, update };