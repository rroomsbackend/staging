import { db } from '../../../models';
import config from '../../../config';
import sequelize, { NOW } from 'sequelize';
const Op = sequelize.Op
import moment from 'moment';
import { createAtDateFormat } from '../../../utils/date-query';

export default {
    async create(req, res, next) {
        const {
            propertyId,
            categoryId,
            suplierId,
            employeeId,
            itemId,
            itemName,
            unit,
            quantity,
            //avaiableQuantity,
            price,
            totalAmount,
            remark,
            mfdDate,
            expDate,
            status,
            stockType,
            //reasonToOutStock,
            createdBy
        } = req.body;
        const remarks = remark ? remark : null
        let avaiableQuantity = quantity
        const reasonToOutStock = null

        const totalAvaiableQuantity = await db.Inventory.findOne({ where: { propertyId: propertyId, itemId: itemId }, attributes: ['avaiableQuantity'], order: [['id', 'desc']], limit: 1 })
        //Sum of previous remaining quantity
        if (totalAvaiableQuantity) {
            avaiableQuantity = avaiableQuantity + totalAvaiableQuantity.get('avaiableQuantity');
        }

        await db.Inventory.create({
            propertyId,
            categoryId,
            suplierId,
            employeeId,
            itemId,
            itemName,
            unit,
            quantity,
            avaiableQuantity,
            price,
            totalAmount,
            remarks,
            mfdDate,
            expDate,
            status,
            reasonToOutStock,
            createdBy
        })
            .then(result => {
                return res.status(200).json({ status: true, message: "Item created successfully" })
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async out(req, res, next) {
        const {
            propertyId,
            categoryId,
            itemId,
            //suplierId,
            employeeId,
            quantity,
            remark,
            status,
            reasonToOutStock,
            updatedBy
        } = req.body;
        await db.Inventory.findOne({ where: { itemId: itemId, propertyId: propertyId }, order: [['id', 'desc']], limit: 1 }).then(async result => {
            if (result) {
                const data = JSON.parse(JSON.stringify(result))
                delete data.id;
                // if(suplierId){
                //     data['suplierId'] = suplierId
                // }
                if (propertyId) {
                    data['propertyId'] = propertyId
                }
                if (employeeId) {
                    data['employeeId'] = employeeId
                }

                if (categoryId) {
                    data['categoryId'] = categoryId
                }
                //data['status'] = 1

                if (data?.avaiableQuantity >= quantity) {
                    const aqt = data?.avaiableQuantity - quantity
                    data['avaiableQuantity'] = aqt > 0 ? aqt : 0
                    data['quantity'] = quantity
                    data['totalAmount'] = data?.price * quantity
                    data['remarks'] = remark ? remark : null
                    data['status'] = 1
                    data['stockType'] = 1
                    data['reasonToOutStock'] = reasonToOutStock ? reasonToOutStock : null
                    data['updatedBy'] = updatedBy
                    db.Inventory.create(data).then(resp => {
                        return res.status(200).json({ status: true, message: 'Stock updated' });
                    }).catch(error => {
                        return res.status(400).json({ status: false, message: error });
                    })
                } else {
                    return res.status(400).json({ status: false, message: 'No avaiable quantity as you entered quantity to out' });
                }
            } else {
                return res.status(400).json({ status: false, message: "No record found by passed property id, category and item id." });
            }
        }).catch(error => {
            return res.status(400).json({ status: false, message: error?.message });
        })
    },

    async update(req, res, next) {
        const {
            propertyId,
            categoryId,
            suplierId,
            employeeId,
            itemId,
            itemName,
            unit,
            quantity,
            avaiableQuantity,
            price,
            totalAmount,
            remark,
            mfdDate,
            expDate,
            status,
            stockType,
            reasonToOutStock,
            createdBy
        } = req.body;
        const remarks = remark ? remark : null
        console.log({
            propertyId,
            categoryId,
            suplierId,
            employeeId,
            itemId,
            itemName,
            unit,
            quantity,
            avaiableQuantity,
            price,
            totalAmount,
            remarks,
            mfdDate,
            expDate,
            status,
            stockType,
            reasonToOutStock,
            createdBy
        });
        await db.Inventory.update({
            propertyId,
            categoryId,
            suplierId,
            employeeId,
            itemId,
            itemName,
            unit,
            quantity,
            avaiableQuantity,
            price,
            totalAmount,
            remarks,
            mfdDate,
            expDate,
            status,
            stockType,
            reasonToOutStock,
            createdBy
        }, { where: { id: req.params.id } })
            .then(result => {
                if (result)
                    return res.status(200).json({ status: true, message: "Item updated successfully" });
                else
                    return res.status(200).json({ status: false, message: "Failed!" });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async get(req, res) {
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false, attributes: ['id', 'name'] },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false, attributes: ['id', 'name', 'suplierCode', 'email', 'mobile'] },
                { model: db.PropertyUser, required: false, attributes: ['id', 'propertyId', 'userCode', 'firstName', 'lastName'] },
                //{ model: db.PropertyMaster, required: false, attributes: ['id', 'name', 'propertyCode', 'locality']}
            ]
        }

        const selector = Object.assign({}, selection);
        await db.Inventory.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getById(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false, attributes: ['id', 'name'] },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false, attributes: ['id', 'name', 'suplierCode', 'email', 'mobile'] },
                { model: db.PropertyUser, required: false, attributes: ['id', 'propertyId', 'userCode', 'firstName', 'lastName'] },
                //{ model: db.PropertyMaster, required: false, attributes: ['id', 'name', 'propertyCode', 'locality']}
            ],
            where: { id: id }
        }

        const selector = Object.assign({}, selection);
        await db.Inventory.findOne(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getByUserId(req, res) {
        const id = req.params.id;
        const { fromDate, toDate } = req.query;
        const filter = await createAtDateFormat(fromDate, toDate)
        if (id) {
            filter['createdBy'] = id
        }

        const selection = {
            include: [
                { model: db.InventoryCategories, required: false, attributes: ['id', 'name'] },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false, attributes: ['id', 'name', 'suplierCode', 'email', 'mobile'] },
                { model: db.PropertyUser, required: false, attributes: ['id', 'propertyId', 'userCode', 'firstName', 'lastName'] },
                //{ model: db.PropertyMaster, required: false, attributes: ['id', 'name', 'propertyCode', 'locality']}
            ],
            where: [filter]
        }
        const selector = Object.assign({}, selection);
        await db.Inventory.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getByPropertyId(req, res) {
        const id = req.params.id;
        const { fromDate, toDate } = req.query;
        const filter = await createAtDateFormat(fromDate, toDate)
        if (id) {
            filter['propertyId'] = id
        }
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false, attributes: ['id', 'name'] },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false, attributes: ['id', 'name', 'suplierCode', 'email', 'mobile'] },
                { model: db.PropertyUser, required: false, attributes: ['id', 'propertyId', 'userCode', 'firstName', 'lastName'] },
                //{ model: db.PropertyMaster, required: false, attributes: ['id', 'name', 'propertyCode', 'locality']}
            ],
            where: [filter]
        }
        const selector = Object.assign({}, selection);
        await db.Inventory.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getByCategoryId(req, res) {
        const id = req.params.id;
        const { fromDate, toDate } = req.query;
        const filter = await createAtDateFormat(fromDate, toDate)
        if (id) {
            filter['categoryId'] = id
        }
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false, attributes: ['id', 'name'] },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false, attributes: ['id', 'name', 'suplierCode', 'email', 'mobile'] },
                { model: db.PropertyUser, required: false, attributes: ['id', 'propertyId', 'userCode', 'firstName', 'lastName'] },
                //{ model: db.PropertyMaster, required: false, attributes: ['id', 'name', 'propertyCode', 'locality']}
            ],
            where: [filter]
        }
        const selector = Object.assign({}, selection);
        await db.Inventory.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getBySuplierId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false, attributes: ['id', 'name'] },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false, attributes: ['id', 'name', 'suplierCode', 'email', 'mobile'] },
                { model: db.PropertyUser, required: false, attributes: ['id', 'propertyId', 'userCode', 'firstName', 'lastName'] },
                //{ model: db.PropertyMaster, required: false, attributes: ['id', 'name', 'propertyCode', 'locality']}
            ],
            where: { suplierId: id }
        }
        const selector = Object.assign({}, selection);
        await db.Inventory.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async addSuplierItems(req, res, next) {
        const { propertyId, suplierId, categoryId, itemId, quantity, price, createdBy } = req.body
        db.SuplierItem.create({ propertyId: propertyId, suplierId: suplierId, categoryId: categoryId, itemId: itemId, quantity: quantity, price: price, createdBy: createdBy })
            .then(result => {
                return res.status(200).json({ status: true, data: result, message: "Item added successfully" });
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message })
            })
    },

    async updateSuplierItemById(req, res, next) {
        const { propertyId, suplierId, categoryId, itemId, quantity, price, createdBy } = req.body
        const id = req.params.id;
        db.SuplierItem.update({ propertyId: propertyId, suplierId: suplierId, categoryId: categoryId, itemId: itemId, quantity: quantity, price: price, createdBy: createdBy }, { where: { id: id } })
            .then(result => {
                return res.status(200).json({ status: true, data: result, message: "Item updated successfully" });
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async deleteSuplierItemById(req, res, next) {
        const id = req.params.id;
        db.SuplierItem.destroy({ where: { id: id } })
            .then(result => {
                if (result) {
                    return res.status(200).json({ status: true, message: "Item deleted successfully" });
                } else {
                    return res.status(200).json({ status: true, data: result, message: "not found!" });
                }
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async getSuplierItems(req, res, next) {
        const { keyName, value } = req.body
        const http = {}
        if (keyName && value) {
            http[keyName] = value
        }
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false, attributes: ['id', 'name'] },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false, attributes: ['id', 'name', 'suplierCode', 'email', 'mobile'] },
                //{ model: db.PropertyMaster, required: false, attributes: ['id', 'name', 'propertyCode', 'locality']}
            ],
            where: [http]
        }

        db.SuplierItem.findAll(selection)
            .then(result => {
                return res.status(200).json({ status: true, data: result, message: "Item fetched successfully" });
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    }

};