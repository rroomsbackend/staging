// routes/menuItem.routes.js
import express from 'express';
import * as menuItemController from './menu-items.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const menuItemRouter = express.Router();

menuItemRouter.route('/')
    .get(sanitize(), verifyJWTToken, menuItemController.getAllMenuItems)
    .post(sanitize(), verifyJWTToken, menuItemController.createMenuItem);

menuItemRouter.route('/:id')
    .get(sanitize(), verifyJWTToken, menuItemController.getMenuItemById)
    .put(sanitize(), verifyJWTToken, menuItemController.updateMenuItemById)
    .delete(sanitize(), verifyJWTToken, menuItemController.deleteMenuItemById);

menuItemRouter.route('/property/:propertyId')
    .get(sanitize(), verifyJWTToken, menuItemController.getMenuItemsByPropertyId);