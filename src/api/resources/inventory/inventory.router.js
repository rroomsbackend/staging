import express from 'express';
import categoryController from './category.controller';
import itemController from './item.controller'
import suplierController from './supliers.controller'
import inStockController from './instock.controller'
import outstocksController from './outstocks.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { validateBody, schemas } from '../../../middleware/validator';
import { loginCheck } from '../../../middleware/auth';
import inventoryStock from './inventory.controller';
import inventoryValidation from './inventory.validation';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const inventory = express.Router();
inventory.route('/category').post(sanitize(), verifyJWTToken, categoryController.create)
inventory.route('/category/:id').put(sanitize(), verifyJWTToken, categoryController.update)
inventory.route('/category').get(sanitize(), verifyJWTToken, categoryController.get)
inventory.route('/category/:id').get(sanitize(), verifyJWTToken, categoryController.getById)
inventory.route('/category-user/:id').get(sanitize(), verifyJWTToken, categoryController.getByUserId)
inventory.route('/category-property/:id').get(sanitize(), verifyJWTToken, categoryController.getByPropertyId)

//Items
inventory.route('/items').post(sanitize(), verifyJWTToken, itemController.create)
inventory.route('/items/:id').put(sanitize(), verifyJWTToken, itemController.update)
inventory.route('/items').get(sanitize(), verifyJWTToken, itemController.get)
inventory.route('/items/:id').get(sanitize(), verifyJWTToken, itemController.getById)
inventory.route('/items-user/:id').get(sanitize(), verifyJWTToken, itemController.getByUserId)
inventory.route('/items-property/:id').get(sanitize(), verifyJWTToken, itemController.getByPropertyId)
inventory.route('/items-category/:id').get(sanitize(), verifyJWTToken, itemController.getByCategoryId)

//Supliers
inventory.route('/supliers').post(sanitize(), verifyJWTToken, suplierController.create)
inventory.route('/supliers/:id').put(sanitize(), verifyJWTToken, suplierController.update)
inventory.route('/supliers').get(sanitize(), verifyJWTToken, suplierController.get)
inventory.route('/supliers/:id').get(sanitize(), verifyJWTToken, suplierController.getById)
inventory.route('/supliers-user/:id').get(sanitize(), verifyJWTToken, suplierController.getByUserId)
inventory.route('/supliers-property/:id').get(sanitize(), verifyJWTToken, suplierController.getByPropertyId)
inventory.route('/supliers-category/:id').get(sanitize(), verifyJWTToken, suplierController.getByCategoryId)

//Inventory InStock
inventory.route('/in-stock').post(sanitize(), verifyJWTToken, inStockController.create)
inventory.route('/in-stock/:id').put(sanitize(), verifyJWTToken, inStockController.update)
inventory.route('/in-stock').get(sanitize(), verifyJWTToken, inStockController.get)
inventory.route('/in-stock/:id').get(sanitize(), verifyJWTToken, inStockController.getById)
inventory.route('/in-stock-user/:id').get(sanitize(), verifyJWTToken, inStockController.getByUserId)
inventory.route('/in-stock-property/:id').get(sanitize(), verifyJWTToken, inStockController.getByPropertyId)
inventory.route('/in-stock-category/:id').get(sanitize(), verifyJWTToken, inStockController.getByCategoryId)
inventory.route('/in-stock-suplier/:id').get(sanitize(), verifyJWTToken, inStockController.getBySuplierId)

//Inventory OutStock
inventory.route('/out-stock').post(sanitize(), verifyJWTToken, outstocksController.create)
inventory.route('/out-stock/:id').put(sanitize(), verifyJWTToken, outstocksController.update)
inventory.route('/out-stock').get(sanitize(), verifyJWTToken, outstocksController.get)
inventory.route('/out-stock/:id').get(sanitize(), verifyJWTToken, outstocksController.getById)
inventory.route('/out-stock-user/:id').get(sanitize(), verifyJWTToken, outstocksController.getByUserId)
inventory.route('/out-stock-property/:id').get(sanitize(), verifyJWTToken, outstocksController.getByPropertyId)
inventory.route('/out-stock-category/:id').get(sanitize(), verifyJWTToken, outstocksController.getByCategoryId)
inventory.route('/out-stock-suplier/:id').get(sanitize(), verifyJWTToken, outstocksController.getBySuplierId)

//Inventory Management
inventory.route('/inventory-stock').post(sanitize(), verifyJWTToken, validateBody(inventoryValidation.store), inventoryStock.create)
inventory.route('/inventory-stock-out').post(sanitize(), verifyJWTToken, validateBody(inventoryValidation.out), inventoryStock.out)
inventory.route('/inventory-stock/:id').put(sanitize(), verifyJWTToken, inventoryStock.update)
inventory.route('/inventory-stock').get(sanitize(), verifyJWTToken, inventoryStock.get)
inventory.route('/inventory-stock/:id').get(sanitize(), verifyJWTToken, inventoryStock.getById)
inventory.route('/inventory-stock-user/:id').get(sanitize(), verifyJWTToken, inventoryStock.getByUserId)
inventory.route('/inventory-stock-property/:id').get(sanitize(), verifyJWTToken, inventoryStock.getByPropertyId)
inventory.route('/inventory-stock-category/:id').get(sanitize(), verifyJWTToken, inventoryStock.getByCategoryId)
inventory.route('/inventory-stock-suplier/:id').get(sanitize(), verifyJWTToken, inventoryStock.getBySuplierId)
inventory.route('/inventory-suplier-item').post(sanitize(), verifyJWTToken, inventoryStock.addSuplierItems)
inventory.route('/inventory-suplier-item/:id').put(sanitize(), verifyJWTToken, inventoryStock.updateSuplierItemById)
inventory.route('/inventory-suplier-item/:id').delete(sanitize(), verifyJWTToken, inventoryStock.deleteSuplierItemById)
inventory.route('/inventory-suplier-item-get').post(sanitize(), verifyJWTToken, inventoryStock.getSuplierItems)



