import { log } from 'console';
import { db } from '../../../models';

export default {

    async getCityByStateId(req, res) {
        const id = req.params.id;
        const selection = {
            where: { state_id: id },
            order: [['name', 'ASC']]
        }
        const selector = Object.assign({}, selection);
        await db.cities.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                res.status(400).json({ status: false, message: err.message });
            });

    },

    async get(req, res) {
        await db.cities.findAll({ order: [['name', 'ASC']] }).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                res.status(400).json({ status: false, message: err.message });
            });

    },

    async getById(req, res) {
        const id = req.params.id;
        await db.cities.findOne({ where: { id: id } }).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                res.status(400).json({ status: false, message: err.message });
            });

    },

    async create(req, res) {
        const { name, state_id, state_code, country_id, hub_id, status } = req.body;
        let city_img = req.file ? `uploads/cities/${req.file.filename}` : null; // Store file path
        // console.log(name, state_id, state_code, country_id, status, city_img)
        await db.cities.create({ name: name, state_id: state_id, state_code: state_code, country_id: country_id, hub_id: hub_id, status: status, city_img: city_img }).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ status: false, message: err.message });
            });
    },

    async update(req, res) {
        // const id = req.params.id;
        // const { name, state_id, state_code, country_id, status } = req.body;
        // let city_img = req.file ? req.file.filename : null;
        // await db.cities.update({ name: name, state_id: state_id, state_code: state_code, country_id: country_id, status: status, city_img: city_img }, { where: { id: id } }).then(result => {
        //     return res.status(200).json({ data: result, status: true });
        // })
        //     .catch((err) => {
        //         res.status(400).json({ status: false, message: err.message });
        //     });
        try {
            const { name, state_id, state_code, country_id, hub_id, status } = req.body;
            let city_img = req.file ? `uploads/cities/${req.file.filename}` : undefined;
            let updateData = { name, state_id, state_code, country_id, hub_id, status };
            if (city_img) updateData.city_img = city_img; // Update only if a new image is uploaded
            const result = await db.cities.update(updateData, { where: { id: req.params.id } });
            return res.status(200).json({ data: result, status: true });
        } catch (err) {
            return res.status(400).json({ status: false, message: err.message });
        }
    },

    async delete(req, res) {
        const id = req.params.id;
        await db.cities.destroy({ where: { id: id } }).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                res.status(400).json({ status: false, message: err.message });
            });
    }
};