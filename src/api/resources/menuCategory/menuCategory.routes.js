// routes/menuCategory.routes.js
import express from 'express';
import * as menuCategoryController from './menuCategory.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const menuCategoryRouter = express.Router();

menuCategoryRouter.route('/')
    .get(sanitize(), verifyJWTToken, menuCategoryController.getAllMenuCategories)
    .post(sanitize(), verifyJWTToken, menuCategoryController.createMenuCategory);



menuCategoryRouter.route('/:id')
    .get(sanitize(), verifyJWTToken, menuCategoryController.getMenuCategoryById)
    .put(sanitize(), verifyJWTToken, menuCategoryController.updateMenuCategoryById)
    .delete(sanitize(), verifyJWTToken, menuCategoryController.deleteMenuCategoryById);

menuCategoryRouter.route('/property/:propertyId')
    .get(sanitize(), verifyJWTToken, menuCategoryController.getMenuCategoriesByPropertyId);