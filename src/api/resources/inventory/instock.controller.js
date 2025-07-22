import { db } from '../../../models';
import config from '../../../config';

export default {
    async create(req, res, next) {
        const {
            propertyId,
            categoryId,
            suplierId,
            itemId,
            itemName,
            unit,
            quantity,
            price,
            totalAmount,
            password,
            mfdDate,
            expDate,
            status,
            createdBy
        } = req.body;
        await db.InventoryInStocks.create({
            propertyId,
            categoryId,
            suplierId,
            itemId,
            itemName,
            unit,
            quantity,
            price,
            totalAmount,
            password,
            mfdDate,
            expDate,
            status,
            createdBy
        })
            .then(result => {
                if (result) {
                    db.InventoryItems.findOne({ where: { id: itemId } }).then(item => {
                        const oldQuantity = item?.dataValues?.quantity ? item?.dataValues?.quantity : 0;
                        item.update({ quantity: parseInt(oldQuantity) + parseInt(quantity) })
                    });
                    return res.status(200).json({ status: true, message: "Item added in stock successfully" });
                }
                else
                    return res.status(200).json({ status: false, message: "Item adding failed!" });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async update(req, res, next) {
        const {
            propertyId,
            categoryId,
            suplierId,
            itemName,
            unit,
            itemId,
            quantity,
            price,
            totalAmount,
            password,
            mfdDate,
            expDate,
            status,
            createdBy
        } = req.body;
        await db.InventoryInStocks.update({
            propertyId,
            categoryId,
            suplierId,
            itemName,
            unit,
            itemId,
            quantity,
            price,
            totalAmount,
            password,
            mfdDate,
            expDate,
            status,
            createdBy
        }, { where: { id: req.params.id } })
            .then(result => {
                if (result) {
                    db.InventoryItems.findOne({ where: { id: itemId } }).then(item => {
                        const oldQuantity = item?.dataValues?.quantity ? item?.dataValues?.quantity : 0;
                        item.update({ quantity: parseInt(oldQuantity) + parseInt(quantity) })
                    });
                    return res.status(200).json({ status: true, message: "Item updated in stock successfully" });
                }
                else
                    return res.status(200).json({ status: false, message: "Item adding failed!" });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async get(req, res) {
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false },
                { model: db.PropertyMaster, required: false }
            ]
        }

        const selector = Object.assign({}, selection);
        await db.InventoryInStocks.findAll(selector).then(result => {
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
                { model: db.InventoryCategories, required: false },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false },
                { model: db.PropertyMaster, required: false }
            ],
            where: { id: id }
        }

        const selector = Object.assign({}, selection);
        await db.InventoryInStocks.findOne(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getByUserId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false },
                { model: db.PropertyMaster, required: false }
            ],
            where: { createdBy: id }
        }
        const selector = Object.assign({}, selection);
        await db.InventoryInStocks.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getByPropertyId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false },
                { model: db.PropertyMaster, required: false }
            ],
            where: { propertyId: id }
        }
        const selector = Object.assign({}, selection);
        await db.InventoryInStocks.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getByCategoryId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false },
                { model: db.PropertyMaster, required: false }
            ],
            where: { categoryId: id }
        }
        const selector = Object.assign({}, selection);
        await db.InventoryInStocks.findAll(selector).then(result => {
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
                { model: db.InventoryCategories, required: false },
                { model: db.InventoryItems, required: false },
                { model: db.Supliers, required: false },
                { model: db.PropertyMaster, required: false }
            ],
            where: { suplierId: id }
        }
        const selector = Object.assign({}, selection);
        await db.InventoryInStocks.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },
};