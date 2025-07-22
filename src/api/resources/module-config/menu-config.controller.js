import { db } from '../../../models';
import sequelize from 'sequelize';
import { getPagination, getPagingData } from '../pagination';
const Op = sequelize.Op

export default {
    async create(req, res) {
        const { group_id, menu_name, web_route, app_route, icon } = req.body;
        const groupData = await db.ModuleConfigGroupMaster.findOne({ where: { id: group_id } });
        if (groupData) {
            await db.ModuleConfigMenuMaster.create({ groupId: groupData.id, menuName: menu_name, webRoute:web_route, appRoute:app_route, icon:icon })
                .then(async (result) => {
                    if (result) {
                        return res.status(200).json({ status: true, message: "Module Menu Added successfully", data: result });
                    }
                    else
                        return res.status(200).json({ status: false, message: "failed!" });
                })
                .catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
        } else {
            return res.status(404).json({ status: false, message: `no group data associated with this group_id->${group_id}` });
        }
    },

    async update(req, res) {
        try {
            const { group_id, menu_name, web_route, app_route, icon } = req.body;
            const groupData = await db.ModuleConfigGroupMaster.findOne({ where: { id: group_id } });

            if (groupData) {
                db.ModuleConfigMenuMaster.update({ groupId: group_id, menuName: menu_name, webRoute:web_route, appRoute:app_route, icon:icon }, { where: { id: req.params.id } })
                    .then(result => {
                        console.log(result)
                        return res.status(200).json({ data: result, status: true, msg: "Module menu details updated successfully" });
                    })
                    .catch(err => {
                        return res.status(400).json({ status: false, message: err.message });
                    });
            } else {
                return res.status(404).json({ status: false, message: `no group data associated with this group_id->${group_id}` });
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    async get(req, res) {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);

        const selection = {
            // include: [
            //     { model: db.ModuleConfigGroupMaster, required: false, as:'group' },
            // ],
            offset: offset,
            limit: limit
        }

        const selector = Object.assign({}, selection);
        await db.ModuleConfigMenuMaster.findAndCountAll(selector).then(result => {
            return res.status(200).json({ ...getPagingData(result, page, limit), status: true });
        }).catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
    },

    async getById(req, res) {
        const id = req.params.id;
        const menuSelection = {
            // include: [
            //     {
            //         model: db.PropertyModuleConfig, required: false
            //     }
            // ],
            where: { id: id }
        }
        const selector = Object.assign({}, menuSelection);
        db.ModuleConfigMenuMaster.findOne(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    async getAllByGroupId(req, res) {
        const id = req.params.id;
        const menuSelection = {
            // include: [
            //     {
            //         model: db.PropertyModuleConfig, required: false
            //     }
            // ],
            where: { groupId: id }
        }
        const selector = Object.assign({}, menuSelection);
        db.ModuleConfigMenuMaster.findAll(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    async delete(req, res) {
        await db.ModuleConfigMenuMaster.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(200).json({ status: false, message: err.message });
        })
    },

};
