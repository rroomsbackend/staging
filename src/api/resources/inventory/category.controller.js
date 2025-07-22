import { db } from '../../../models';
import config from '../../../config';

export default {
    async create(req, res, next) {
        const {
            name,
            propertyId,
            createdBy,
            updatedBy,
            deletedBy,
            status
        } = req.body;
        await db.InventoryCategories.create({
            name,
            propertyId,
            createdBy,
            updatedBy,
            deletedBy,
            status
        })
            .then(result => {
                if (result)
                    return res.status(200).json({ status: true, message: "Category created successfully" });
                else
                    return res.status(200).json({ status: false, message: "Category creating failed!" });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async update(req, res, next) {
        const {
            name,
            propertyId,
            createdBy,
            updatedBy,
            deletedBy,
            status
        } = req.body;
        await db.InventoryCategories.update({
            name,
            propertyId,
            createdBy,
            updatedBy,
            deletedBy,
            status
        }, { where: { id: req.params.id } })
            .then(result => {
                if (result)
                    return res.status(200).json({ status: true, msg: "Category updated successfully" });
                else
                    return res.status(200).json({ status: false, msg: "Category updation failed!" });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async get(req, res) {
        const selection = {
            /*include: [
                { model: db.User, required: false}
            ]*/
        }

        const selector = Object.assign({}, selection);
        await db.InventoryCategories.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getById(req, res) {
        const id = req.params.id;
        const selection = {
            /*include: [
                { model: db.User, required: false}
            ],*/
            where: { id: id }
        }

        const selector = Object.assign({}, selection);
        await db.InventoryCategories.findOne(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getByUserId(req, res) {
        const id = req.params.id;
        const selection = {
            /*include: [
                { model: db.User, required: false}
            ],*/
            where: { createdBy: id }
        }
        const selector = Object.assign({}, selection);
        await db.InventoryCategories.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    },

    async getByPropertyId(req, res) {
        const id = req.params.id;
        const selection = {
            /*include: [
                { model: db.User, required: false}
            ],*/
            where: { propertyId: id }
        }
        const selector = Object.assign({}, selection);
        await db.InventoryCategories.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });

    }
};