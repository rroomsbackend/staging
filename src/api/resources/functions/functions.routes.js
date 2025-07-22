// routes/functions.routes.js
import express from 'express';
import * as FunctionsController from './functions.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const functionsRouter = express.Router();

functionsRouter.route('/')
    .get(sanitize(), verifyJWTToken, FunctionsController.getAllFunctions)
    .post(sanitize(), verifyJWTToken, FunctionsController.createFunction);

functionsRouter.route('/:id')
    .get(sanitize(), verifyJWTToken, FunctionsController.getFunctionById)
    .put(sanitize(), verifyJWTToken, FunctionsController.updateFunctionById)
    .delete(sanitize(), verifyJWTToken, FunctionsController.deleteFunctionById);

functionsRouter.route('/property/:propertyId')
    .get(sanitize(), verifyJWTToken, FunctionsController.getFunctionsByPropertyId);
