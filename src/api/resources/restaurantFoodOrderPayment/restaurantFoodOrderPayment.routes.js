import express from 'express';
import * as RestaurantFoodOrderPaymentController from './restaurantFoodOrderPaymentController';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const restaurantFoodOrderPaymentRouter = express.Router();

restaurantFoodOrderPaymentRouter.route('/payment')
    .get(sanitize(), verifyJWTToken, RestaurantFoodOrderPaymentController.get)
    .post(sanitize(), verifyJWTToken, RestaurantFoodOrderPaymentController.create);

restaurantFoodOrderPaymentRouter.route('/payment/:id')
    .get(sanitize(), verifyJWTToken, RestaurantFoodOrderPaymentController.getById)
    .put(sanitize(), verifyJWTToken, RestaurantFoodOrderPaymentController.update)
    .delete(sanitize(), verifyJWTToken, RestaurantFoodOrderPaymentController.deletePayment);

restaurantFoodOrderPaymentRouter.route('/payment-report').get(RestaurantFoodOrderPaymentController.restFoodOrderPaymentReport)