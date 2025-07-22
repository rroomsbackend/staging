import express from 'express';
import * as RestaurantFoodOrderController from './restaurantFoodOrderController';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';
const multer = require('multer');

export const restaurantFoodOrderRouter = express.Router();
const storage = multer.memoryStorage(); // Use memory storage for handling files before uploading to S3
const upload = multer({ storage: storage });

restaurantFoodOrderRouter.route('/order')
    .get(sanitize(), verifyJWTToken, RestaurantFoodOrderController.get)
    .post(sanitize(), verifyJWTToken, RestaurantFoodOrderController.create);

restaurantFoodOrderRouter.route('/order/:id')
    .get(sanitize(), verifyJWTToken, RestaurantFoodOrderController.getById)
    .put(sanitize(), verifyJWTToken, RestaurantFoodOrderController.update)
    .delete(sanitize(), verifyJWTToken, RestaurantFoodOrderController.deleteOrder);


restaurantFoodOrderRouter.route('/order-report').get(RestaurantFoodOrderController.downloadRestFoodOrderReport)