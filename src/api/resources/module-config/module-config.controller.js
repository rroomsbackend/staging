import { on } from 'nodemailer/lib/xoauth2';
import { db } from '../../../models';
import sequelize from 'sequelize';
const Op = sequelize.Op

export default {
    async save(req, res) {
        const { property_id, property_user_id, data } = req.body;

        const recordToSave = [];
        data.forEach((obj) => {
            recordToSave.push({
                propertyId: property_id,
                propertyUserId: property_user_id,
                groupId: obj.group_id,
                activeMenuIds: JSON.stringify(obj.active_menu_ids)
            });
        });
        await db.PropertyModuleConfig.bulkCreate(recordToSave, { updateOnDuplicate: ["propertyId", "propertyUserId", "groupId", "activeMenuIds"] })
            .then(async (result) => {
                if (result) {
                    const filter = {};

                    if (property_id) {
                        filter['propertyId'] = parseInt(property_id)
                    }
                    if (property_user_id) {
                        filter['propertyUserId'] = parseInt(property_user_id)
                    }

                    const whereCondition = {};
                    if (Object.keys(filter).length > 0) {
                        whereCondition[Op.and] = filter;
                    }
                    const selection = {
                        attributes: ['id', 'propertyId', 'propertyUserId', 'groupId', 'activeMenuIds'],
                        include: [
                            {
                                model: db.ModuleConfigGroupMaster,
                                required: false,
                                as: 'group',
                                attributes: ['id', 'groupName'],
                                include: [
                                    {
                                        model: db.ModuleConfigMenuMaster,
                                        required: true,
                                        as: 'menues',
                                        attributes: ['id', 'groupId', 'menuName', 'webRoute', 'appRoute', 'icon'],
                                    }
                                ],
                            },
                        ],
                        where: whereCondition
                    }

                    const selector = Object.assign({}, selection);
                    await db.PropertyModuleConfig.findAll(selector).then(result => {
                        const transformResponse = (response) => {
                            response.forEach(item => {
                                if (item.group) {
                                    const activeMenuIds = JSON.parse(item.activeMenuIds);
                                    item.group.menues = item.group.menues.map(menu => {
                                        const obj = Object.assign(menu.dataValues, { isActive: activeMenuIds.includes(menu.id) });
                                        return obj;
                                    });
                                }
                            });
                            return response;
                        };
                        const transformedResponse = transformResponse(result);
                        return res.status(200).json({ data: transformedResponse, status: true });
                    }).catch((err) => {
                        return res.status(400).json({ status: false, message: err.message });
                    });
                    //return res.status(200).json({ status: true, message: "Module Config created or updated successfully", data: result });
                }
                else
                    return res.status(200).json({ status: false, message: "failed!" });
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async get(req, res) {
        const { propertyId, property_user_id } = req.query;

        const filter = {};

        if (propertyId) {
            filter['propertyId'] = parseInt(propertyId)
        }
        if (property_user_id) {
            filter['propertyUserId'] = parseInt(property_user_id)
        }

        const whereCondition = {};
        if (Object.keys(filter).length > 0) {
            whereCondition[Op.and] = filter;
        }
        const selection = {
            attributes: ['id', 'propertyId', 'propertyUserId', 'groupId', 'activeMenuIds'],
            include: [
                {
                    model: db.ModuleConfigGroupMaster,
                    required: false,
                    as: 'group',
                    attributes: ['id', 'groupName'],
                    include: [
                        {
                            model: db.ModuleConfigMenuMaster,
                            required: true,
                            as: 'menues',
                            attributes: ['id', 'groupId', 'menuName', 'webRoute', 'appRoute', 'icon'],
                        }
                    ],
                },
            ],
            where: whereCondition
        }

        const selector = Object.assign({}, selection);
        await db.PropertyModuleConfig.findAll(selector).then(result => {
            const transformResponse = (response) => {
                response.forEach(item => {
                    if (item.group) {
                        const activeMenuIds = JSON.parse(item.activeMenuIds);
                        item.group.menues = item.group.menues.map(menu => {
                            const obj = Object.assign(menu.dataValues, { isActive: activeMenuIds.includes(menu.id) });
                            return obj;
                        });
                    }
                });
                return response;
            };
            const transformedResponse = transformResponse(result);
            return res.status(200).json({ data: transformedResponse, status: true });
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
        db.PropertyModuleConfig.findOne(selector)
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
        db.PropertyModuleConfig.findAll(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    async delete(req, res) {
        await db.PropertyModuleConfig.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(200).json({ status: false, message: err.message });
        })
    },
};
