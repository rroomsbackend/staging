import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const update = Joi.object({
    title: Joi.string()
    .required(),
    amount: Joi.number()
        .min(1)
        .max(100)
        .required()
});

export default { update };