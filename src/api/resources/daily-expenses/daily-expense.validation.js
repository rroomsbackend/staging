const Joi = require('joi');

const schema = Joi.object({
    propertyId: Joi.number().required(),
    amount: Joi.number().required(),
    reason: Joi.string().required(),
    remarks: Joi.string().required(),
    expenceType: Joi.string().required(),
    expenceSubType: Joi.string().required(),
    paymentSource: Joi.number().required(),
    refNumber: Joi.string().required(),
    expenseDate: Joi.date().required(),
});

export default { schema };