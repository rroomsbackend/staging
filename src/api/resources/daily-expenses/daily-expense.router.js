import express from 'express';
import dailyExpenseController from './daily-expense.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { validateBody } from '../../../middleware/validator';
import dailyExpenseValidation from './daily-expense.validation';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const dailyExpenseRouter = express.Router();

dailyExpenseRouter.route('/:id').get(sanitize(), verifyJWTToken, dailyExpenseController.getById);
dailyExpenseRouter.route('').get(sanitize(), verifyJWTToken, dailyExpenseController.get);
dailyExpenseRouter.route('').post(sanitize(), verifyJWTToken, validateBody(dailyExpenseValidation.schema), dailyExpenseController.create);
dailyExpenseRouter.route('/:id').put(sanitize(), verifyJWTToken, validateBody(dailyExpenseValidation.schema), dailyExpenseController.update);
dailyExpenseRouter.route('/:id').delete(sanitize(), verifyJWTToken, dailyExpenseController.delete);