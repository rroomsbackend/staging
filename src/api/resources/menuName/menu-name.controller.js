// controllers/menuNameController.js
import * as menuNameService from './menu-name.service';

export const createMenuName = async (req, res) => {
    const { propertyId, menuName } = req.body;
    try {
        const newMenuName = await menuNameService.createMenuName({ propertyId, menuName });
        return res.status(201).send({success: true, message: 'menus names created successfully', data: newMenuName})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const getAllMenuNames = async (req, res) => {
    try {
        const menuNames = await menuNameService.getAllMenuNames(req.query);
        return res.status(200).send({success: true, message: 'menu names fetched successfully', data: menuNames})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const getMenuNameById = async (req, res) => {
    const { id } = req.params;
    try {
        const menuName = await menuNameService.getMenuNameById(id);
        return res.status(200).send({success: true, message: 'men names dtails fetched successfully', data: menuName})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const updateMenuNameById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedMenuName = await menuNameService.updateMenuNameById(id, updates);
        return res.status(200).send({success: true, message: 'upated successfully', data: updatedMenuName})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const deleteMenuNameById = async (req, res) => {
    const { id } = req.params;
    try {
        await menuNameService.deleteMenuNameById(id);
        return res.status(200).send({success: true, message: 'deleted successfully'})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const getMenuNamesByPropertyId = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const menuNames = await menuNameService.getMenuNamesByPropertyId(propertyId);
        return res.status(200).send({success: true, message: 'menu names by propertyId fetched successfully', data: menuNames})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};
