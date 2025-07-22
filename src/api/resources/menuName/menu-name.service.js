// services/menuNameService.js
import { db } from "../../../models";

const MenuName = db.menuName;

export const createMenuName = async ({ propertyId, menuName }) => {
    try {
        return await MenuName.create({ propertyId, menuName });
    } catch (error) {
        throw new Error('Unable to create menu name');
    }
};

export const getAllMenuNames = async (query) => {
    try {
        const { propertyId } = query;
        const selection = {
            order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            where: {}
        };
        if (propertyId) selection.where["propertyId"] = propertyId;

        return await MenuName.findAll(selection);
    } catch (error) {
        throw new Error('Unable to fetch menu names');
    }
};

export const getMenuNameById = async (id) => {
    try {
        const menuName = await MenuName.findByPk(id);
        if (!menuName) {
            throw new Error('Menu name not found');
        }
        return menuName;
    } catch (error) {
        throw new Error('Unable to fetch menu name');
    }
};

export const updateMenuNameById = async (id, updates) => {
    try {
        const [updatedRowsCount, updatedRows] = await MenuName.update(updates, {
            where: { id },
            returning: true,
        });
        if (updatedRowsCount === 0) {
            throw new Error('Menu name not found');
        }
        return updatedRows[0];
    } catch (error) {
        throw new Error('Unable to update menu name');
    }
};

export const deleteMenuNameById = async (id) => {
    try {
        const deletedRowCount = await MenuName.destroy({ where: { id } });
        if (deletedRowCount === 0) {
            throw new Error('Menu name not found');
        }
    } catch (error) {
        throw new Error('Unable to delete menu name');
    }
};

export const getMenuNamesByPropertyId = async (propertyId) => {
    try {
        return await MenuName.findAll({ where: { propertyId } });
    } catch (error) {
        throw new Error('Unable to fetch menu names by propertyId');
    }
};