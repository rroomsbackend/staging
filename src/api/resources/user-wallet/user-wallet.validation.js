import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const store = Joi.object({
    referral_code: Joi.string().required(),
    new_user_id: Joi.number().required()
});

const update = Joi.object({
    booking_amount: Joi.number().required()
});

export default { store, update };