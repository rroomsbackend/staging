// routes/restaurantMenuItem.routes.js
import express from 'express';
import * as RevenueReportController from './revenue-report.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const revenueReportRouter = express.Router();

revenueReportRouter.route('/revenue-report-by-month')
    .get(sanitize(), RevenueReportController.getRevenueReportByMonth);

revenueReportRouter.route('/revenue-report-by-date')
    .get(sanitize(), RevenueReportController.getRevenueReportByDate);

revenueReportRouter.route('/download-revenue-report-by-month')
    .get(sanitize(), RevenueReportController.downloadRevenueReportByMonth);

revenueReportRouter.route('/download-revenue-report-by-date')
    .get(sanitize(), RevenueReportController.downloadRevenueReportByDate);
