// controllers/RestaurantMenuItemController.js
import * as RestaurantMenuItemService from './restaurantMenuItemService';

export const createRestaurantMenuItem = async (req, res) => {
    try {
        const { items } = req.body;
        console.log("items", items);
        const restaurantMenuItem = await RestaurantMenuItemService.createRestaurantMenuItem(items);
        return res.status(201).json({success: true, data: restaurantMenuItem, message: 'menu items created successfully'});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getRestaurantMenuItems = async (req, res) => {
    try {
        const { search } = req.query;
        const restaurantMenuItems = await RestaurantMenuItemService.getRestaurantMenuItems(search);
        return res.status(200).json({succes: true, data: restaurantMenuItems, message: 'fetched menu successfully'});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getRestaurantMenuItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const restaurantMenuItem = await RestaurantMenuItemService.getRestaurantMenuItemById(id);
        if (!restaurantMenuItem) {
            return res.status(404).json({ error: 'Restaurant menu item not found' });
        }
        return res.status(200).json(restaurantMenuItem);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateRestaurantMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRestaurantMenuItem = await RestaurantMenuItemService.updateRestaurantMenuItem(id, req.body);
        return res.status(200).json(updatedRestaurantMenuItem);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteRestaurantMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        await RestaurantMenuItemService.deleteRestaurantMenuItem(id);
        return res.status(204).send('Restaurant menu item deleted');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
