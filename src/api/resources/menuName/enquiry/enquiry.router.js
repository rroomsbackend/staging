import express from 'express';
import enquiryController from './enquiry.controller';
import enquiryValidation from './enquiry.validation';
import { sanitize } from '../../../middleware/sanitizer';
import { validateBody } from '../../../middleware/validator';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const enquiry = express.Router();

enquiry.route('/enquiry').get(sanitize(), verifyJWTToken, enquiryController.get)
enquiry.route('/enquiry').post(sanitize(), validateBody(enquiryValidation.store), enquiryController.create);
enquiry.route('/enquiry/:id').put(sanitize(), verifyJWTToken, validateBody(enquiryValidation.store), enquiryController.update);
enquiry.route('/enquiry-remark/:id/:assign_to').put(sanitize(), verifyJWTToken, validateBody(enquiryValidation.remark), enquiryController.remark);
enquiry.route('/enquiry-assign/:id').put(sanitize(), verifyJWTToken, validateBody(enquiryValidation.assign), enquiryController.assign);
enquiry.route('/enquiry/:id').delete(sanitize(), verifyJWTToken, enquiryController.destroy);
