import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const updateUser = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required()
});

export default { updateUser };