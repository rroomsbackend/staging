import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const store = Joi.object({
    source: Joi.string().required(),
    fromDate: Joi.date().required(),
    toDate: Joi.date().required(),
    noOfRooms: Joi.number().greater(0).required()
});

export default { store };