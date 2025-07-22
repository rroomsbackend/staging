import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const store = Joi.object({
    propertyId: Joi.number().required(),
    categoryId: Joi.number().required(),
    suplierId: Joi.number().required(),
    employeeId: Joi.number().optional(),
    itemId: Joi.number().required(),
    quantity: Joi.number().required(),
    itemName: Joi.string().required(),
    price: Joi.number().required(),
    totalAmount: Joi.number().required(),
    createdBy: Joi.number().required(),
    unit: Joi.string().optional(),
    avaiableQuantity: Joi.number().optional(),
    remark: Joi.string().optional(),
    mfdDate: Joi.date().optional(),
    expDate: Joi.date().optional(),
    status: Joi.number().optional(),
    stockType: Joi.number().optional(),
    reasonToOutStock: Joi.date().optional(),
    createdBy: Joi.number().optional()
});

const out = Joi.object({
    propertyId: Joi.number().required(),
    //categoryId: Joi.number().required(),
    //suplierId: Joi.number().required(),
    employeeId: Joi.number().required(),
    itemId: Joi.number().required(),
    quantity: Joi.number().required(),
    remark: Joi.string().optional(),
    reasonToOutStock: Joi.string().optional(),
    updatedBy: Joi.number().optional(),
    status: Joi.number().optional(),
});

export default { store, out };