// services/menuItemService.js
import { db } from '../../../models';

const MenuItem = db.menuItem;
export const createMenuItem = async ({ propertyId, menuNameId, menuCategoryId, itemName }) => {
    try {
        return await MenuItem.create({ propertyId, menuNameId, menuCategoryId, itemName });
    } catch (error) {
        console.error(error)
        throw new Error('Unable to create menu item');
    }
};

export const getAllMenuItems = async (query) => {
    try {
        const { propertyId } = query;
        const selection = {
            order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            where: {},
            include: [
                {model: db.menuName},
                {model: db.menuCategory}
            ]
        };
        if (propertyId) selection.where["propertyId"] = propertyId;
        return await MenuItem.findAll(selection);
    } catch (error) {
        console.log(error);
        throw new Error('Unable to fetch menu items');
    }
};

export const getMenuItemById = async (id) => {
    try {
        const menuItem = await MenuItem.findByPk(id,{
            include: [
                {model: db.menuName},
                {model: db.menuCategory}
            ]
        });
        if (!menuItem) {
            throw new Error('Menu item not found');
        }
        return menuItem;
    } catch (error) {
        throw new Error('Unable to fetch menu item');
    }
};

export const updateMenuItemById = async (id, updates) => {
    try {
        const [updatedRowsCount, updatedRows] = await MenuItem.update(updates, {
            where: { id },
            returning: true,
        });
        if (updatedRowsCount === 0) {
            throw new Error('Menu item not found');
        }
        return updatedRows[0];
    } catch (error) {
        throw new Error('Unable to update menu item');
    }
};

export const deleteMenuItemById = async (id) => {
    try {
        const deletedRowCount = await MenuItem.destroy({ where: { id } });
        if (deletedRowCount === 0) {
            throw new Error('Menu item not found');
        }
    } catch (error) {
        throw new Error('Unable to delete menu item');
    }
};

export const getMenuItemsByPropertyId = async (propertyId) => {
    try {
        return await MenuItem.findAll({ where: { propertyId } });
    } catch (error) {
        throw new Error('Unable to fetch menu items by propertyId');
    }
};
