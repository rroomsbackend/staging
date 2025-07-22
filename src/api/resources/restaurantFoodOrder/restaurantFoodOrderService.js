import { db } from '../../../models';
import { createExcelSheet } from '../../../utils/createExcelSheet'
const Sequelize = require('sequelize');
import * as ExcelJS from 'exceljs';
const { Op } = Sequelize;

export const createOrder = async (data) => {
    const {
        userId, bookingId, roomNumber, orderAmount, paidAmount, paymentStatus, orderStatus,
        orderNote, customerMobile, customerEmail, orderType, otherGuestName, orderItems, remark, createdBy, propertyId, tableNumber, customerGst,
    } = data;
    try {
        const newOrder = await db.RestaurantFoodOrder.create({
            userId, bookingId, roomNumber, orderAmount, paidAmount, paymentStatus, orderStatus,
            orderNote, orderType, otherGuestName, orderItems, remark, createdBy, propertyId, customerMobile, customerEmail, tableNumber, customerGst,
        });

        return newOrder;
    } catch (err) {
        throw new Error(err.message)
    }
};

export const updateOrder = async (id, data) => {
    const {
        userId, bookingId, roomNumber, orderAmount, paidAmount, paymentStatus, orderStatus,
        orderNote, orderType, otherGuestName, orderItems, remark, createdBy, customerMobile, customerEmail, tableNumber
    } = data;
    try {

        const order = await db.RestaurantFoodOrder.findOne({ where: { id } });
        if (!order) throw new Error(`No order found by this id - ${id}`);

        await order.update({
            userId, bookingId, roomNumber, orderAmount, paidAmount, paymentStatus, orderStatus,
            orderNote, orderType, otherGuestName, orderItems, remark, createdBy, customerMobile, customerEmail, tableNumber
        });

        return order;

    } catch (err) {
        throw new Error(err.message)
    }
};

export const getOrders = async (query, limit, offset) => {
    try {
        const { propertyId, bookingId, tableNumber, orderStatus, fromAt, toAt } = query;
        const selection = {
            order: [['id', 'DESC'], ['updatedAt', 'DESC']],
            where: {}
        };

        if (propertyId) selection.where["propertyId"] = propertyId;
        if (bookingId) selection.where["bookingId"] = bookingId;
        if (tableNumber) selection.where["tableNumber"] = tableNumber;
        if (tableNumber) selection.where["orderStatus"] = orderStatus;
        if (limit && offset) {
            selection["limit"] = limit,
                selection['offset'] = offset;
        }
        // if (date) {
        //     if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(date)) throw new Error("Invalid date format. e.g: 'YYYY-MM-DD'");
        //     selection.where[Op.and] = [Sequelize.where(Sequelize.fn('date', Sequelize.col('RestaurantFoodOrder.createdAt')), '=', date)];
        // }
        if (fromAt && toAt) {
            if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(fromAt) || !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(toAt)) throw new Error("Invalid date format. e.g: 'YYYY-MM-DD'");
            selection.where.createdAt = { [Op.between]: [fromAt, toAt] };
        }

        const orders = await db.RestaurantFoodOrder.findAndCountAll(selection);
        return orders;
    } catch (err) {
        console.log(err);
    }
};

export const getOrderById = async (id) => {
    try {

        const order = await db.RestaurantFoodOrder.findOne({
            where: { id }
        });
        if (!order) throw new Error(`No order found by this id - ${id}`);
        return order;

    } catch (err) {
        throw new Error(err.message)
    }
};

export const deleteOrder = async (id) => {
    try {
        const order = await db.RestaurantFoodOrder.findOne({ where: { id } });
        if (!order) throw new Error(`No order found by this id - ${id}`);
        await db.RestaurantFoodOrder.destroy({ where: { id } });
        return order;
    } catch (err) {
        throw new Error(err.message)
    }
};

// donload reoprt
export const downloadRestaurantFoodOrderReport = async (query) => {
    const { propertyId, fromDate, toDate } = query;
    let whereClause = {};

    if (propertyId) {
        whereClause.propertyId = propertyId;
    }

    if (fromDate && toDate) {
        whereClause.createdAt = {
            [Op.between]: [new Date(fromDate), new Date(toDate)]
        };
    }

    try {
        let banquetBookings = await db.RestaurantFoodOrder.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC'],
            ],
            raw: true,
        });

        return await createExcelSheet(banquetBookings);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};
