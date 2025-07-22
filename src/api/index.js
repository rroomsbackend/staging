import express from 'express';
import { authRouter } from './resources/auth';
import { rroomsProperty } from './resources/rrooms-property';
import { roomBooking } from './resources/room-booking';
import { enquiry } from './resources/enquiry';
import { country } from './resources/country';
import { inventory } from './resources/inventory';
import { kpiRouter } from './resources/kpi';
import { restaurantRouter } from './resources/restaurantMenu'
import { functionsRouter } from './resources/functions';
import { venueRouter } from './resources/venue/venue.routes';
import { menuNameRouter } from './resources/menuName/menu-name.routes';
import { menuItemRouter } from './resources/menuItems/menu-items.routes';
import { menuCategoryRouter } from './resources/menuCategory/menuCategory.routes';
import { banquetRouter } from './resources/banquet'
import { restaurantBookingRouter } from './resources/restaurent-table-booking'
import { restaurantFoodOrderRouter } from './resources/restaurantFoodOrder/restaurantFoodOrder.routes'
import { restaurantFoodOrderPaymentRouter } from './resources/restaurantFoodOrderPayment/restaurantFoodOrderPayment.routes'
import { moduleConfigRouter } from './resources/module-config';
import { dailyExpenseRouter } from './resources/daily-expenses';
import { revenueReportRouter } from './resources/revenue-report';
import { expenceCatSubcatRouter } from './resources/expence-cate-subcate';

export const restRouter = express.Router();

restRouter.use('/auth', authRouter);
restRouter.use('/rrooms-property', rroomsProperty);
restRouter.use('/booking', roomBooking);
restRouter.use('/customer', enquiry);
restRouter.use('/country', country);
restRouter.use('/expence', expenceCatSubcatRouter)
restRouter.use('/inventory', inventory);
restRouter.use('/kpi', kpiRouter);
restRouter.use('/restaurant', restaurantRouter);
restRouter.use('/functions', functionsRouter);
restRouter.use('/venue', venueRouter);
restRouter.use('/menuName', menuNameRouter);
restRouter.use('/menuCategory', menuCategoryRouter);
restRouter.use('/menuItem', menuItemRouter);
restRouter.use('/banquet', banquetRouter)
restRouter.use('/table', restaurantBookingRouter)
restRouter.use('/rest-order', restaurantFoodOrderRouter)
restRouter.use('/rest-payment', restaurantFoodOrderPaymentRouter)
restRouter.use('/module-config', moduleConfigRouter);
restRouter.use('/rrooms-property/daily-expense', dailyExpenseRouter);
restRouter.use('/revenue-report', revenueReportRouter);