// services/menuCategoryService.js
import { db } from '../../../models';

const MenuCategory = db.menuCategory;

export const createMenuCategory = async ({ propertyId, categoryName }) => {
    try {
        return await MenuCategory.create({ propertyId, categoryName });
    } catch (error) {
        console.error(error)
        throw new Error('Unable to create menu category');
    }
};

export const getAllMenuCategories = async (query) => {
    try {
        const { propertyId } = query;
        const selection = {
            order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            where: {}
        };
        if (propertyId) selection.where["propertyId"] = propertyId;

        return await MenuCategory.findAll(selection);
    } catch (error) {
        throw new Error('Unable to fetch menu categories');
    }
};

export const getMenuCategoryById = async (id) => {
    try {
        const menuCategory = await MenuCategory.findByPk(id);
        if (!menuCategory) {
            throw new Error('Menu category not found');
        }
        return menuCategory;
    } catch (error) {
        throw new Error('Unable to fetch menu category');
    }
};

export const updateMenuCategoryById = async (id, updates) => {
    try {
        const [updatedRowsCount, updatedRows] = await MenuCategory.update(updates, {
            where: { id },
            returning: true,
        });
        if (updatedRowsCount === 0) {
            throw new Error('Menu category not found');
        }
        return updatedRows[0];
    } catch (error) {
        throw new Error('Unable to update menu category');
    }
};

export const deleteMenuCategoryById = async (id) => {
    try {
        const deletedRowCount = await MenuCategory.destroy({ where: { id } });
        if (deletedRowCount === 0) {
            throw new Error('Menu category not found');
        }
    } catch (error) {
        throw new Error('Unable to delete menu category');
    }
};

export const getMenuCategoriesByPropertyId = async (propertyId) => {
    try {
        return await MenuCategory.findAll({ where: { propertyId } });
    } catch (error) {
        throw new Error('Unable to fetch menu categories by propertyId');
    }
};
