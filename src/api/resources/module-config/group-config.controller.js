import { db } from '../../../models';
import sequelize from 'sequelize';
import { getPagination, getPagingData } from '../pagination';
const Op = sequelize.Op

export default {
    async create(req, res) {
        const { name, icon } = req.body;

        await db.ModuleConfigGroupMaster.create({ groupName: name, icon:icon })
            .then(async (result) => {
                if (result) {
                    return res.status(200).json({ status: true, message: "Module Group Added successfully", data: result });
                }
                else
                    return res.status(200).json({ status: false, message: "failed!" });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async update(req, res) {
        try {
            const { name, icon} = req.body;
            db.ModuleConfigGroupMaster.update({ groupName: name, icon:icon }, { where: { id: req.params.id } })
                .then(result => {
                    return res.status(200).json({ data: result, status: true, msg: "Module group details updated successfully" });
                })
                .catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    async get(req, res) {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);

        const selection = {
            include: [
                { model: db.ModuleConfigMenuMaster, required: false, as:'menues' },
            ],
            offset: offset,
            limit: limit
        }

        const selector = Object.assign({}, selection);
        await db.ModuleConfigGroupMaster.findAndCountAll(selector).then(result => {
            return res.status(200).json({ ...getPagingData(result, page, limit), status: true });
        }).catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
    },

    async getById(req, res) {
        const id = req.params.id;
        const groupSelection = {
            include: [
                {
                    model: db.ModuleConfigMenuMaster, required: false, as: 'menus'
                }
            ],
            where: { id: id }
        }
        const selector = Object.assign({}, groupSelection);
        db.ModuleConfigGroupMaster.findOne(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    },

    async delete(req, res) {
        await db.ModuleConfigGroupMaster.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(200).json({ status: false, message: err.message });
        })
    },

};
