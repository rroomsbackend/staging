// routes/menuName.routes.js

import express from 'express';
import * as menuNameController from './menu-name.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const menuNameRouter = express.Router();

menuNameRouter.route('/')
    .get(sanitize(), verifyJWTToken, menuNameController.getAllMenuNames)
    .post(sanitize(), verifyJWTToken, menuNameController.createMenuName);

menuNameRouter.route('/:id')
    .get(sanitize(), verifyJWTToken, menuNameController.getMenuNameById)
    .put(sanitize(), verifyJWTToken, menuNameController.updateMenuNameById)
    .delete(sanitize(), verifyJWTToken, menuNameController.deleteMenuNameById);

menuNameRouter.route('/property/:propertyId')
    .get(sanitize(), verifyJWTToken, menuNameController.getMenuNamesByPropertyId);
