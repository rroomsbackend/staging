import express from 'express';
import roomKpiController from './roomKpi.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const kpiRouter = express.Router();
kpiRouter.route('/room-count-with-status').post(sanitize(), roomKpiController.roomCountWithStatus);
kpiRouter.route('/booking-count-with-status').post(sanitize(), verifyJWTToken, roomKpiController.bookingCountWithStatus);
kpiRouter.route('/property-count-with-status').post(sanitize(), verifyJWTToken, roomKpiController.propertyCountWithStatus);
kpiRouter.route('/food-order-count-with-status').post(sanitize(), verifyJWTToken, roomKpiController.foodOrderCountWithStatus);
//Download Report
kpiRouter.route('/booking-report').get(sanitize(), roomKpiController.downloadBookingReport);
kpiRouter.route('/booking-payment-report').get(sanitize(), roomKpiController.downloadBookingPaymentReport);
kpiRouter.route('/booking-food-payment-report').get(sanitize(), verifyJWTToken, roomKpiController.downloadFoodPaymentReport);
kpiRouter.route('/inventory-report').get(sanitize(), verifyJWTToken, roomKpiController.downloadInventoryReport);
kpiRouter.route('/food-order-report').get(sanitize(), verifyJWTToken, roomKpiController.downloadFoodOrderReport);
kpiRouter.route('/food-order-payment-report').get(sanitize(), verifyJWTToken, roomKpiController.downloadFoodOrderPaymentReport);
kpiRouter.route('/loundary-report').get(sanitize(), verifyJWTToken, roomKpiController.downloadLoundaryReport);
kpiRouter.route('/customer-report').get(sanitize(), verifyJWTToken, roomKpiController.downloadCustomerReport);
kpiRouter.route('/booking-count-with-userby').get(sanitize(), verifyJWTToken, roomKpiController.downloadBookingReportByUser);
kpiRouter.route('/get-transaction-report').get(sanitize(), verifyJWTToken, roomKpiController.downloadTransactionReport);
kpiRouter.route('/get-rating-report').get(sanitize(), verifyJWTToken, roomKpiController.downloadRatingReport);
kpiRouter.route('/select-property').get(sanitize(), verifyJWTToken, roomKpiController.getProperty);