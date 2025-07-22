import { db } from '../../../models';

export default {

    async getByCountryId(req, res) {
        const id = req.params.id;
        await db.states.findAll({where : {country_id:id}, order: [['name', 'ASC']]}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async get(req, res) {
        await db.states.findAll({order: [['name', 'ASC']]}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async getById(req, res) {
        const id = req.params.id;
        await db.states.findOne({where: {id: id}}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async create(req, res) {
        const { name, iso2, country_id, status } = req.body;
        await db.states.create({name:name, iso2:iso2, country_id:country_id, status:status}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async update(req, res) {
        const id = req.params.id;
        const { name, iso2, country_id, status } = req.body;
        await db.states.update({name:name, iso2:iso2, country_id:country_id, status:status}, {where: {id: id} }).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async delete(req, res) {
        const id = req.params.id;
        await db.states.destroy({where: {id: id} }).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        }); 
    }
};