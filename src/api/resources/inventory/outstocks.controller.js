import { db } from '../../../models';
import config from '../../../config';

export default {
    async create(req, res, next) {
        const {
            propertyId,
            categoryId,
            employeeId,
            itemId,
            itemName,
            unit,
            quantity,
            price,
            totalAmount,
            remark,
            mfdDate,
            expDate,
            status,
            reasonToOutStock,
            createdBy
        } = req.body;
        await db.InventoryOutStocks.create({ 
            propertyId,
            categoryId,
            employeeId,
            itemId,
            itemName,
            unit,
            quantity,
            price,
            totalAmount,
            remark,
            mfdDate,
            expDate,
            status,
            reasonToOutStock,
            createdBy
        })
        .then(result => {            
            db.InventoryItems.find({ where: {id:itemId}}).then(stock => {
                if(stock){
                    const remainingQuantity = stock?.dataValues?.quantity - quantity;
                    stock.update({quantity: remainingQuantity});
                    return res.status(200).json({ status: true ,message: "Item outed successfully"});
                }else{
                    return res.status(200).json({ status: false ,message: "Item quantation updation failed!"});
                }
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message});
            });
        })
        .catch(err => {
            return res.status(400).json({ status: false, message: err.message});
        });
        
    },

    async update(req, res, next) { 
        const {
            propertyId,
            categoryId,
            employeeId,
            itemName,
            unit,
            quantity,
            price,
            totalAmount,
            remark,
            mfdDate,
            expDate,
            status,
            reasonToOutStock,
            createdBy
        } = req.body;
        await db.InventoryOutStocks.update({ 
            propertyId,
            categoryId,
            employeeId,
            itemName,
            unit,
            quantity,
            price,
            totalAmount,
            remark,
            mfdDate,
            expDate,
            status,
            reasonToOutStock,
            createdBy
        }, { where: {id:req.params.id }})
        .then(result => {
            if(result)
                return res.status(200).json({ status: true ,message: "Item updated for out stock successfully"});
            else
            return res.status(200).json({ status: false ,message: "Item out failed!"});
        })
        .catch(err => {
            return res.status(400).json({ status: false, message: err.message});
        });
        
    },

    async get(req, res) {
        const selection = {
            include: [
                 { model: db.InventoryCategories, required: false},
                 { model: db.InventoryItems, required: false},
                 { model: db.PropertyUser, required: false},
                 { model: db.PropertyMaster, required: false}
            ]
        }
    
        const selector = Object.assign({}, selection);
        await db.InventoryOutStocks.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    },

    async getById(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false},
                { model: db.InventoryItems, required: false},
                { model: db.PropertyUser, required: false},
                { model: db.PropertyMaster, required: false}
            ],
            where : {id:id}
        }
    
        const selector = Object.assign({}, selection);
        await db.InventoryOutStocks.findOne(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    },

    async getByUserId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false},
                { model: db.InventoryItems, required: false},
                { model: db.PropertyUser, required: false},
                { model: db.PropertyMaster, required: false}
            ],
            where : {createdBy:id}
        }    
        const selector = Object.assign({}, selection);
        await db.InventoryOutStocks.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    },

    async getByPropertyId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false},
                { model: db.InventoryItems, required: false},
                { model: db.PropertyUser, required: false},
                { model: db.PropertyMaster, required: false}
            ],
            where : {propertyId:id}
        }    
        const selector = Object.assign({}, selection);
        await db.InventoryOutStocks.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    },

    async getByCategoryId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false},
                { model: db.InventoryItems, required: false},
                { model: db.PropertyUser, required: false},
                { model: db.PropertyMaster, required: false}
            ],
            where : {categoryId:id}
        }    
        const selector = Object.assign({}, selection);
        await db.InventoryOutStocks.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    },

    async getBySuplierId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false},
                { model: db.InventoryItems, required: false},
                { model: db.PropertyUser, required: false},
                { model: db.PropertyMaster, required: false}
            ],
            where : {suplierId:id}
        }    
        const selector = Object.assign({}, selection);
        await db.InventoryOutStocks.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    },
};