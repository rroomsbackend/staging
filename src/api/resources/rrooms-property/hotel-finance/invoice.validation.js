import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

const offlinePayment = Joi.object({
    invoice_id: Joi.string().min(1).required(),
    payment_source: Joi.string().required(),
    payment_date:Joi.string().required(),
    ref_number:Joi.string().required()
});


function validateInvoiceFormDataBody(formData) {
        const result = Joi.validate(formData, offlinePayment);
        if (result.error) {
            return false
        }
        return true
}
module.exports.validateInvoiceFormDataBody = validateInvoiceFormDataBody;