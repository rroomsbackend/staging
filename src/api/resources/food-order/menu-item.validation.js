import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

let items = Joi.object().keys({
    property_id: Joi.number()
    .required(),
    category_id: Joi.string()
    .optional(),
    name: Joi.string()  
    .required(),
    price: Joi.number()
    .required(),
    gstType: Joi.string()
    .required(),
    gstPercent: Joi.number()
    .required(),
    quantity: Joi.number()
    .required()
});

const store = Joi.object({
    items: Joi.array()
        .items(items)
        .required()
})

export default { store };