import * as orderService from './restaurantFoodOrderService';
import { getPagination, getPagingData } from '../pagination';

const fs = require('fs');

export const create = async (req, res) => {
    try {
        const result = await orderService.createOrder(req.body);
        return res.status(200).json({ status: true, message: 'Order created successfully', data: result });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({ status: false, message: error?.message });
    }
};

export const update = async (req, res) => {
    try {
        const result = await orderService.updateOrder(req.params.id, req.body);
        return res.status(200).json({ status: true, message: "Order updated successfully", data: result });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({ status: false, message: error?.message });
    }
};

export const get = async (req, res) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const result = await orderService.getOrders(req.query, limit, offset);
        return res.status(200).json({ status: true, ...getPagingData(result, page, limit) });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({ status: false, message: error?.message });
    }
};

export const getById = async (req, res) => {
    try {
        const result = await orderService.getOrderById(req.params.id);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const result = await orderService.deleteOrder(req.params.id);
        return res.status(200).json({ status: true, message: 'Order deleted successfully', data: result });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

export const downloadRestFoodOrderReport = async (req, res) => {
    try {
        const workbook = await orderService.downloadRestaurantFoodOrderReport(req.query);
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=restaurant_food_order_report.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        return res.status(500).send({ status: false, message: 'Something went wrong', error: err.message })
    }
}