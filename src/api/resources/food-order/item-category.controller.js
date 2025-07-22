import { db } from '../../../models';

export default {
    async create(req, res, next) {
        const { name } = req.body;
        await db.FoodItemCategory.create({ name })
            .then(result => {
                return res.status(200).json({ status: true, data: result, message: "Item category created successfully" });
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async update(req, res, next) {
        const { name } = req.body;
        await db.FoodItemCategory.update({ name }, { where: { id: req.params.id } })
            .then(result => {
                return res.status(200).json({ status: true, data: result, msg: "Item category updated successfully" });
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async get(req, res) {
        const selection = {
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: [
                { deletedAt: null }
            ],
        }
        const selector = Object.assign({}, selection);
        await db.FoodItemCategory.findAll(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async getById(req, res) {
        const id = req.params.id;
        db.FoodItemCategory.findOne({ where: { id: id } })
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async delete(req, res, next) {
        const id = req.params.id;
        db.FoodItemCategory.findOne({ where: { id: id } })
            .then(result => {
                db.FoodItemCategory.destroy({ where: { id: req.params.id } }).then(result => {
                    if (result)
                        return res.status(200).json({ status: true, data: result });
                    else
                        return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
                }).catch(err => {
                    return res.status(500).json({ status: false, message: err.message });
                })
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },
};