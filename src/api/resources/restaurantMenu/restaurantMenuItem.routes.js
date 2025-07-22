// routes/restaurantMenuItem.routes.js
import express from 'express';
import * as RestaurantMenuItemController from './restaurantMenuItem.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const restaurantRouter = express.Router();

restaurantRouter.route('/menu-item')
    .get(sanitize(), verifyJWTToken, RestaurantMenuItemController.getRestaurantMenuItems)
    .post(sanitize(), verifyJWTToken, RestaurantMenuItemController.createRestaurantMenuItem);

restaurantRouter.route('/menu-item/:id')
    .put(sanitize(), verifyJWTToken, RestaurantMenuItemController.updateRestaurantMenuItem)
    .get(sanitize(), verifyJWTToken, RestaurantMenuItemController.getRestaurantMenuItemById)
    .delete(sanitize(), verifyJWTToken, RestaurantMenuItemController.deleteRestaurantMenuItem);

