import { db } from '../../../models';
export default {

    async get(req, res) {
        await db.countries.findAll({order: [['name', 'ASC']]}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async create(req, res) {
        const { name, iso3 } = req.body;
        await db.countries.create({name:name, iso3:iso3}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async update(req, res) {
        const id = req.params.id;
        const { name, iso3 } = req.body;
        await db.countries.update({ name:name, iso3:iso3, where: {id: id} }).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async getById(req, res) {
        const id = req.params.id;
        await db.countries.findOne({ where: {id: id} }).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async delete(req, res) {
        const id = req.params.id;
        await db.countries.destroy({ where: {id: id} }).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

};