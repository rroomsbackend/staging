import express from 'express';
import * as RestaurantBookingController from './restaurentTableBooking.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const restaurantBookingRouter = express.Router();

restaurantBookingRouter.route('/table-booking')
    .post(sanitize(), verifyJWTToken, RestaurantBookingController.createRestaurantBooking)
    .get(sanitize(), verifyJWTToken, RestaurantBookingController.getRestaurantAllBooking);


restaurantBookingRouter.route('/table-booking/:id')
    .put(sanitize(), verifyJWTToken, RestaurantBookingController.updateRestaurantBookingById)
    .delete(sanitize(), verifyJWTToken, RestaurantBookingController.deleteRestaurantBookingById);

