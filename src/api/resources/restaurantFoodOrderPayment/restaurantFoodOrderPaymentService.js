import { db } from '../../../models';
import { createExcelSheet } from '../../../utils/createExcelSheet'

const Sequelize = require('sequelize');
const { Op } = Sequelize;

const arrayColumn = (arr, n) => arr.map(x => x[n]);

export const createPayment = async (data) => {
    const { orderId, propertyId, paymentAmount, paymentMode, transactionId, bookingId } = data;
    try {

        if (bookingId) {
            const foodOrder = await db.RestaurantFoodOrder.findOne({ where: { bookingId } });
            if (!foodOrder) throw new Error("Invalid booking_id");

            const property = await db.PropertyMaster.findOne({ where: { id: propertyId } });
            if (!property) throw new Error("Invalid property_id");

            const orderPayment = await db.RestaurantFoodOrderPayment.create({
                orderId, transactionId, propertyId, paymentAmount, paymentMode
            });

            const booking = await db.BookingHotel.findOne({ where: { id: bookingId } });
            if (booking) {
                const totalFoodOrderAmount = booking.get('totalFoodAmount');
                const totalPayment = booking.get('collectedFoodAmout') ? booking.get('collectedFoodAmout') + paymentAmount : paymentAmount;
                const status = totalPayment >= totalFoodOrderAmount ? 1 : 0;
                await booking.update({ PaymentStatus: status, collectedFoodAmout: totalPayment });
            }

            return orderPayment;
        } else if (orderId) {
            console.log("orderId", orderId);
            const foodOrder = await db.RestaurantFoodOrder.findOne({ where: { id: orderId, } });
            if (!foodOrder) throw new Error("Invalid order_id");

            const property = await db.PropertyMaster.findOne({ where: { id: propertyId, } });
            if (!property) throw new Error("Invalid property_id");

            const orderPayment = await db.RestaurantFoodOrderPayment.create({
                orderId, bookingId, transactionId, propertyId, paymentAmount, paymentMode
            });

            let paidAmount = foodOrder.paidAmount ? foodOrder.paidAmount + paymentAmount : paymentAmount;
            const status = paidAmount >= foodOrder.orderAmount ? 1 : 0;
            await foodOrder.update({ paymentStatus: status, orderStatus: status, paidAmount });

            return orderPayment;
        } else {
            throw new Error('No data found!');
        }

    } catch (err) {
        console.error(err)
        throw new Error(err.message)
    }
};

export const updatePayment = async (id, data) => {
    try {

        const { orderId, propertyId, paymentAmount, paymentMode, transactionId } = data;

        const foodOrder = await db.RestaurantFoodOrder.findOne({ where: { id: orderId, } });
        if (!foodOrder) throw new Error("Invalid order_id");

        const property = await db.PropertyMaster.findOne({ where: { id: propertyId, } });
        if (!property) throw new Error("Invalid property_id");

        const orderPayment = await db.RestaurantFoodOrderPayment.findOne({ where: { id, } });
        if (!orderPayment) throw new Error(`No record found by this id - ${id}`);

        await orderPayment.update({ orderId, transactionId, propertyId, paymentAmount, paymentMode });
        return orderPayment;

    } catch (er) {
        throw new Error(err.message)
    }
};

export const getPayments = async (query) => {
    try {

        const { orderId, date, propertyId, bookingId, fromAt, toAt } = query;
        const selection = {
            order: [['id', 'DESC'], ['updatedAt', 'DESC']],
            include: [{ model: db.RestaurantFoodOrder, required: false }],
            where: {}
        };

        if (propertyId && !orderId && !date) selection.where.propertyId = propertyId;
        if (bookingId && !propertyId && !orderId && !date) selection.where.bookingId = bookingId;
        if (orderId && !date) selection.where.orderId = orderId;
        if (date) {
            if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(date)) throw new Error("Invalid date format. e.g: 'YYYY-MM-DD'");
            selection.where[Op.and] = [Sequelize.where(Sequelize.fn('date', Sequelize.col('RestaurantFoodOrderPayment.createdAt')), '=', date)];
        }
        if (!bookingId && !propertyId && !orderId && !date && fromAt && toAt) {
            if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(fromAt) || !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(toAt)) throw new Error("Invalid date format. e.g: 'YYYY-MM-DD'");
            selection.where.createdAt = { [Op.between]: [fromAt, toAt] };
        }

        const result = await db.RestaurantFoodOrderPayment.findAll(selection);
        let totalAmountPaid = null;
        if (result.length && orderId) {
            let paymentAmounts = arrayColumn(result, "paymentAmount");
            totalAmountPaid = paymentAmounts.reduce((a, b) => a + b, 0);
        }
        return totalAmountPaid ? { totalAmountPaid, result } : result;

    } catch (err) {
        throw new Error(err.message)
    }
};

export const getPaymentById = async (id) => {
    try {

        const result = await db.RestaurantFoodOrderPayment.findOne({
            where: { id }, include: [{ model: db.RestaurantFoodOrder, required: false }]
        });
        return result;

    } catch (err) {
        throw new Error(err.message)
    }
};

export const deletePayment = async (id) => {
    try {
        const result = await db.RestaurantFoodOrderPayment.findOne({ where: { id } });
        if (!result) throw new Error(`No record found by this id - ${id}`);
        await db.RestaurantFoodOrderPayment.destroy({ where: { id } });
        return result;
    } catch (err) {
        throw new Error(err.message)
    }
};

// download report
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

        let orderPayments = await db.RestaurantFoodOrderPayment.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC'],
            ],
            raw: true,
        });

        return await createExcelSheet(orderPayments);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};