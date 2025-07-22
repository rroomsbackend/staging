import { db } from '../../../models';

export default {

    async getByCityId(req, res) {
        const id = req.params.id;
        console.log("id", id);
        await db.Locality.findAll({where: {city_id: id}, order: [['name', 'ASC']] }).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            console.log("err", err);
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async get(req, res) {
        const id = req.params.id;
        await db.Locality.findAll({order: [['name', 'ASC']]}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async getById(req, res) {
        const id = req.params.id;
        await db.Locality.findOne({where: {id: id}}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
            
    },

    async create(req, res) {
        const { name, city_id, state_id, pin_code, status } = req.body;
        console.log({ name, city_id, state_id, pin_code, status } );
        
        await db.Locality.create({ name:name, city_id:city_id, state_id:state_id, pin_code:pin_code, status:status }).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async update(req, res) {
        const id = req.params.id;
        const { name, city_id, state_id, pin_code, status } = req.body;
        await db.Locality.update({ name:name, cityId:city_id, stateId:state_id, pinCode:pin_code, status:status },{where: {id:id}}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

    async delete(req, res) {
        const id = req.params.id;
        await db.Locality.destroy({where: {id:id}}).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.status(400).json({ status: false, message: err.message});
        });
    },

};