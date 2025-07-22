import { db } from '../../../models';

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default {
    async create(req, res, next) {
        const { nc_type, property_id } = req.body;
        const NcTypeSetting = await db.NcTypeSetting.findOne({ where: { propertyId: property_id } });
        if (NcTypeSetting) {
            return res.status(422).json({ status: false, message: "Nc Type Setting for this property is already exists" });
        }
        await db.NcTypeSetting.create({ ncType: nc_type.toLowerCase(), propertyId: property_id })
            .then(result => {
                return res.status(200).json({ status: true, data: result, message: "Nc Type setting created successfully" });
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async update(req, res, next) {
        const { nc_type, property_id } = req.body;
        await db.NcTypeSetting.update({ ncType: nc_type.toLowerCase() }, { where: { id: req.params.id } })
            .then(result => {
                return res.status(200).json({ status: true, data: result, msg: "Nc Type setting updated successfully" });
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async get(req, res) {
        const { property_id } = req.query;
        const selection = {
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: [
                { deletedAt: null }
            ],
        }
        if (property_id) {
            selection.where = [{
                propertyId: property_id,
                deletedAt: null
            }];
        }
        const selector = Object.assign({}, selection);
        await db.NcTypeSetting.findAll(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async getById(req, res) {
        const id = req.params.id;
        db.NcTypeSetting.findOne({ where: { id: id } })
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },
};