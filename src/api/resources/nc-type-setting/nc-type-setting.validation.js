import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const store = Joi.object({
    nc_type: Joi.string()
        .required(),
    property_id: Joi.number()
        .required()
});

export default { store };