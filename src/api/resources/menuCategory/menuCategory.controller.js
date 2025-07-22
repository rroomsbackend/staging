// controllers/menuCategoryController.js
import * as menuCategoryService from './menuCategory.service';

export const createMenuCategory = async (req, res) => {
    const { propertyId, categoryName } = req.body;
    try {
        const newMenuCategory = await menuCategoryService.createMenuCategory({ propertyId, categoryName });
        return res.status(201).send({success: true, message: 'created successfully', data: newMenuCategory})
    } catch (error) {
        return res.status(500).json({succes: false,  message: error.message });
    }
};

export const getAllMenuCategories = async (req, res) => {
    try {
        const menuCategories = await menuCategoryService.getAllMenuCategories(req.query);
        return res.status(200).send({success: true, message: 'Menu catogory list fetched successfully', data: menuCategories})
    } catch (error) {
        return res.status(500).json({succes: false,  message: error.message });
    }
};

export const getMenuCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const menuCategory = await menuCategoryService.getMenuCategoryById(id);
        return res.status(200).send({success: true, message: 'menu category details', data: menuCategory})
    } catch (error) {
        return res.status(500).json({succes: false,  message: error.message });
    }
};

export const updateMenuCategoryById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedMenuCategory = await menuCategoryService.updateMenuCategoryById(id, updates);
        return res.status(200).send({success: true, message: 'updated successfully', data: updatedMenuCategory})
    } catch (error) {
        return res.status(500).json({succes: false,  message: error.message });
    }
};

export const deleteMenuCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        await menuCategoryService.deleteMenuCategoryById(id);
        return res.status(200).send({success: true, message: 'deleted successfully' })
    } catch (error) {
        return res.status(500).json({succes: false,  message: error.message });
    }
};

export const getMenuCategoriesByPropertyId = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const menuCategories = await menuCategoryService.getMenuCategoriesByPropertyId(propertyId);
        return res.status(200).send({success: true, message: 'menu catgory by proertyId fetched successfully', data: menuCategories})
    } catch (error) {
        return res.status(500).json({succes: false,  message: error.message });
    }
};
