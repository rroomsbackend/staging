// controllers/menuItemController.js
import * as menuItemService from './menu-items.service';

export const createMenuItem = async (req, res) => {
    const { propertyId, menuNameId, menuCategoryId, itemName } = req.body;
    try {
        const newMenuItem = await menuItemService.createMenuItem({ propertyId, menuNameId, menuCategoryId, itemName });
        return res.status(201).send({success: true, message: 'menu items created successfully', data: newMenuItem})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await menuItemService.getAllMenuItems(req.query);
        return res.status(200).send({success: true, message: 'menu items list fetched successfully', data: menuItems})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const getMenuItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const menuItem = await menuItemService.getMenuItemById(id);
        return res.status(200).send({success: true, message: 'menu items details fetched successfully', data: menuItem})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const updateMenuItemById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedMenuItem = await menuItemService.updateMenuItemById(id, updates);
        return res.status(200).send({success: true, message: 'updated successfully', data: updatedMenuItem})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const deleteMenuItemById = async (req, res) => {
    const { id } = req.params;
    try {
        await menuItemService.deleteMenuItemById(id);
        return res.status(200).send({success: true, message: 'deleted successfully' })
    } catch (error) {
        res.status(500).json({succes: false, message: error.message });
    }
};

export const getMenuItemsByPropertyId = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const menuItems = await menuItemService.getMenuItemsByPropertyId(propertyId);
        return res.status(200).send({success: true, message: 'menu items by proertyId fetched successfully', data: menuItems})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};
