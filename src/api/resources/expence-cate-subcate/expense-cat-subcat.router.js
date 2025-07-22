// routes/menuItem.routes.js
import express from 'express';
import * as expenceCatSubcat from './expense-cat-subcat.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const expenceCatSubcatRouter = express.Router();

// Category routers
expenceCatSubcatRouter.route('/add-category')
    .post(sanitize(), expenceCatSubcat.createExpCate);

expenceCatSubcatRouter.route('/get-all-categories')
    .get(sanitize(), expenceCatSubcat.getAllExpenceCat);

expenceCatSubcatRouter.route('/category/:id')
    .get(sanitize(), expenceCatSubcat.getExpCatById)
    .put(sanitize(), expenceCatSubcat.updateExpCatById);

// Sub-category routers
expenceCatSubcatRouter.route('/add-subcategory')
    .post(sanitize(), expenceCatSubcat.createExpSubCate);

expenceCatSubcatRouter.route('/get-all-subcategory')
    .get(sanitize(), expenceCatSubcat.getAllExpenceSubCat);

expenceCatSubcatRouter.route('/subcategory/:id')
    .get(sanitize(), expenceCatSubcat.getExpSubCatById)
    .put(sanitize(), expenceCatSubcat.updateExpSubCatById);