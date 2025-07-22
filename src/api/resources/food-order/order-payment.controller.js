import { db } from '../../../models';
const Sequelize = require('sequelize');
const ExcelJS = require("exceljs");
const Op = Sequelize.Op;

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

const arrayColumn = (arr, n) => arr.map(x => x[n]);

export default {
    async create(req, res, next) {
        const { order_id, property_id, payment_amount, orderAmount, payment_mode, transactionId, booking_id, totalDiscountAmount, status } = req.body;
        console.log("totalDiscountAmount - ", Math.round(totalDiscountAmount));
        try {
            if (booking_id) {
                const foodOrder = await db.FoodOrder.findOne({ where: { bookingId: booking_id, deletedAt: null } });
                if (!foodOrder) {
                    validationResponse("Invalid booking_id");
                }
                const property = await db.PropertyMaster.findOne({ where: { id: property_id, deletedAt: null } })
                if (!property) {
                    validationResponse("Invalid property_id");
                }
                if (status == 1) {
                    db.FoodOrder.update({ paymentStatus: status, afterDiscount: orderAmount }, {
                        where: {
                            bookingId: booking_id,
                            orderStatus: { [Op.ne]: 0 },
                            paymentStatus: 0
                        }
                    })
                }
                await db.FoodOrderPayment.update(
                    {
                        orderAmount: orderAmount,
                        totalDiscountAmount: Math.round(totalDiscountAmount)
                    },
                    {
                        where: { bookingId: booking_id }
                    }
                );

                await db.FoodOrderPayment.create({ orderId: order_id, bookingId: booking_id, transactionId: transactionId, propertyId: property_id, paymentAmount: payment_amount, orderAmount: orderAmount, paymentMode: payment_mode, totalDiscountAmount: Math.round(totalDiscountAmount) })
                    .then(async orderPayment => {
                        // Old Query
                        /*let paidAmount = 0;
                        if(foodOrder.paidAmount && foodOrder.paidAmount > 0){
                            paidAmount = foodOrder.paidAmount  + payment_amount;
                        }else{
                            paidAmount = payment_amount;
                        }
                        const status = paidAmount >= foodOrder.orderAmount ? 1 : 0;
                        db.FoodOrder.update({ paymentStatus: status, orderStatus: status, paidAmount }, { where: { bookingId: booking_id, deletedAt: null } })
                            .then(result => {
                                return res.status(200).json({ status: true, data: result, msg: "Payment created successfully" });
                            }).catch(err => {
                                return res.status(400).json({ status: false, message: err.message });
                            }); */
                        //Updating booking table by booking status
                        await db.BookingHotel.findOne({ where: { id: booking_id } }).then(result => {
                            if (result) {
                                const totalFoodOrderAmount = result.get('totalFoodAmount');
                                const totalPayment = result.get('collectedFoodAmout') ? result.get('collectedFoodAmout') + payment_amount : payment_amount;
                                const status = totalPayment >= totalFoodOrderAmount ? 1 : 0;
                                // result.update({ PaymentStatus: status, collectedFoodAmout: totalPayment }); // comment on 04-06-2025 for food order payement collect
                            }
                        }).catch(err => {
                            return res.status(400).json({ status: false, message: err.message });
                        })
                        return res.status(200).json({ status: true, message: 'Payment created successfully' });
                    }).catch(err => {
                        return res.status(400).json({ status: false, message: err.message });
                    });
            } else if (order_id) {
                const foodOrder = await db.FoodOrder.findOne({ where: { id: order_id, deletedAt: null } });
                if (!foodOrder) {
                    validationResponse("Invalid order_id");
                }
                const property = await db.PropertyMaster.findOne({ where: { id: property_id, deletedAt: null } })
                if (!property) {
                    validationResponse("Invalid property_id");
                }
                await db.FoodOrderPayment.create({ orderId: order_id, bookingId: booking_id, transactionId: transactionId, propertyId: property_id, paymentAmount: payment_amount, orderAmount: orderAmount, paymentMode: payment_mode, totalDiscountAmount: Math.round(totalDiscountAmount) })
                    .then(result => {
                        let paidAmount = 0;
                        if (foodOrder.paidAmount && foodOrder.paidAmount > 0) {
                            paidAmount = foodOrder.paidAmount + payment_amount;
                        } else {
                            paidAmount = payment_amount;
                        }
                        const status = paidAmount >= foodOrder.dueAmount ? 1 : 0;
                        const dueAmnt = foodOrder.dueAmount - payment_amount;
                        const payAmt = foodOrder.paidAmount + payment_amount
                        console.log("foodOrder.dueAmount - ", foodOrder.dueAmount);
                        console.log("paidAmount - ", paidAmount);
                        console.log("payment_amount - ", payment_amount);
                        console.log("dueAmnt - ", dueAmnt);
                        db.FoodOrder.update({ paymentStatus: status, paidAmount: payAmt, dueAmount: dueAmnt }, { where: { id: order_id } })
                            .then(result => {
                                return res.status(200).json({ status: true, data: result, msg: "Payment created successfully" });
                            }).catch(err => {
                                return res.status(400).json({ status: false, message: err.message });
                            });
                    }).catch(err => {
                        return res.status(400).json({ status: false, message: err.message });
                    });
            } else {
                return res.status(400).json({ status: false, message: 'No data found!' });
            }
        } catch (error) {
            return res.status(error?.code ? error.code : 500).json({
                status: false,
                msg: error?.message
            });
        }
    },

    async update(req, res, next) {
        const { order_id, property_id, payment_amount, payment_mode, transactionId } = req.body;
        try {
            const foodOrder = await db.FoodOrder.findOne({ where: { id: order_id, deletedAt: null } });
            if (!foodOrder) {
                validationResponse("Invalid order_id");
            }
            const property = await db.PropertyMaster.findOne({ where: { id: property_id, deletedAt: null } })
            if (!property) {
                validationResponse("Invalid property_id");
            }
            const orderPayment = await db.FoodOrderPayment.findOne({ where: { id: req.params.id, deletedAt: null } })
            if (!orderPayment) {
                validationResponse('No record found by this id - ' + req.params.id);
            }
            await db.FoodOrderPayment.update({ orderId: order_id, transactionId: transactionId, propertyId: property_id, paymentAmount: payment_amount, paymentMode: payment_mode }, { where: { id: req.params.id, deletedAt: null } })
                .then(result => {
                    return res.status(200).json({ status: true, data: result, msg: "Payment updated successfully" });
                }).catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
        } catch (error) {
            return res.status(error?.code ? error.code : 500).json({
                status: false,
                msg: error?.message
            });
        }
    },

    // change in the query apply pagination start
    async get(req, res) {
        try {
            const { order_id, date, property_id, booking_id, from_at, to_at, page, limit } = req.query;
            const pageNumber = parseInt(page, 10) || 1;
            const limitNumber = parseInt(limit, 10) || 20;
            const offset = (pageNumber - 1) * limitNumber;
            const order = {
                model: db.FoodOrder,
                required: false
            };
            const selection = {
                order: [
                    ['id', 'DESC'],
                    ['updatedAt', 'DESC']
                ],
                include: [order],
                where: [
                    { deletedAt: null }
                ],
                limit: limitNumber,  // Set limit for pagination
                offset: offset       // Set offset for pagination
            }
            if (property_id && !order_id && !date) {
                selection.where = [{
                    propertyId: property_id,
                    deletedAt: null
                }];
            }
            if (booking_id && !property_id && !order_id && !date) {
                selection.where = [{
                    bookingId: booking_id,
                    deletedAt: null
                }];
            }
            if (order_id && !date) {
                selection.where = [{
                    orderId: order_id,
                    deletedAt: null
                }];
            }
            if (date) {
                const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                if (!dateRegex.test(date)) {
                    validationResponse("Invalid date format. e.g: 'YYYY-MM-DD'");
                }
                selection.where = [{
                    deletedAt: null,
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('date', Sequelize.col('FoodOrderPayment.createdAt')), '=', date)
                    ]
                }];
            }
            if (!booking_id && !property_id && !order_id && !date && from_at && to_at) {
                const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                if (!dateRegex.test(from_at) || !dateRegex.test(to_at)) {
                    validationResponse("Invalid date format. e.g: 'YYYY-MM-DD'");
                }
                selection.where = [{
                    createdAt: {
                        [Op.between]: [from_at, to_at]
                    },
                    deletedAt: null
                }];
            }
            const selector = Object.assign({}, selection);
            await db.FoodOrderPayment.findAll(selector)
                .then(result => {
                    let totalAmountPaid = null;
                    if (result.length && order_id) {
                        let paymentAmounts = arrayColumn(result, "paymentAmount");
                        totalAmountPaid = paymentAmounts.reduce((a, b) => a + b, 0);
                    }
                    let response = totalAmountPaid ? { "totalAmountPaid": totalAmountPaid, "result": result } : result;
                    return res.status(200).json({ data: response, status: true });
                }).catch((err) => {
                    console.log(err);
                    return res.status(500).json({ status: false, message: err.message });
                })
        } catch (error) {
            return res.status(error?.code ? error.code : 500).json({
                status: false,
                msg: error?.message
            });
        }
    },
    // change in the query apply pagination end

    async getById(req, res) {
        const id = req.params.id;
        db.FoodOrderPayment.findOne({
            where: { id: id }, include: [
                { model: db.FoodOrder, required: false }
            ]
        }).then(result => {
            return res.status(200).json({ data: result, status: true });
        }).catch((err) => {
            return res.status(500).json({ status: false, message: err.message });
        })
    },

    async delete(req, res, next) {
        const id = req.params.id;
        db.FoodOrderPayment.findOne({ where: { id: id } })
            .then(result => {
                db.FoodOrderPayment.destroy({ where: { id: req.params.id } }).then(result => {
                    if (result)
                        return res.status(200).json({ status: true, data: result });
                    else
                        return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
                }).catch(err => {
                    return res.status(500).json({ status: false, message: err.message });
                })
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async applyfoodOrderDiscount(req, res, next) {
        const { discountPercentage, totalFoodAmountBeforeGST } = req.body;
        try {
            // const id = req.params.id;
            // const order = await db.FoodOrder.findOne({ where: { id: id } });
            // if (!order) {
            //     return res.status(404).json({ status: false, message: 'order not found' });
            // }
            // const discountAmount = (booking.dueFoodAmount * foodDiscountPercentage) / 100;
            // const updatedDueAmount = booking.dueFoodAmount - discountAmount;
            // await order.update({
            //     foodDiscountPercentage: foodDiscountPercentage,
            //     dueFoodAmount: updatedDueAmount
            // });
            // return res.status(200).json({
            //     status: true,
            //     message: 'Food discount applied successfully',
            //     updatedDueAmount: updatedDueAmount.toFixed(2),
            //     discountAmount: discountAmount.toFixed(2)
            // });
        } catch (error) {
            return res.status(400).json({ status: false, message: error.message });
        }
    },

    async foodOrderReportExport(req, res, next) {
        try {
            const { propertyId, fromdate, todate, booking_id, orderId } = req.body;
            let bookingId;
            if (booking_id) {
                const getData = await db.BookingHotel.findOne({ where: { bookingCode: booking_id } });
                bookingId = getData?.id;
                if (!bookingId) {
                    return res.status(404).json({ status: false, message: 'Booking not found' });
                }
            }
            const whereConditions = [{ deletedAt: null }];
            // OrderId + BookingId strict match logic
            if (orderId && bookingId) {
                whereConditions.push({ id: orderId });
                whereConditions.push({ bookingId: bookingId });
            } else if (orderId) {
                whereConditions.push({ id: orderId });
            } else if (bookingId) {
                whereConditions.push({ bookingId: bookingId });
            }
            if (propertyId) {
                whereConditions.push({ propertyId });
            }
            if (fromdate && todate) {
                whereConditions.push({
                    createdAt: {
                        [Op.between]: [new Date(fromdate), new Date(todate)],
                    },
                });
            }
            const whereClause = { [Op.and]: whereConditions };
            const orders = await db.FoodOrder.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.BookingHotel,
                        attributes: ['bookingCode', 'assignRoomNo', 'otherPersonName'],
                    },
                    {
                        model: db.PropertyUser,
                        as: 'acceptedByUser',
                        attributes: ['firstName', 'lastName'],
                    },
                    {
                        model: db.PropertyUser,
                        as: 'deliveredByUser',
                        attributes: ['firstName', 'lastName'],
                    },
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['name'],
                    },
                    {
                        model: db.PropertyUser,
                        as: 'createdByUser',
                        attributes: ['firstName', 'lastName'],
                    },
                ],
                order: [['createdAt', 'DESC']],
                raw: true,
                nest: true,
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Food Orders");
            worksheet.columns = [
                { header: "SN.", key: "sn", width: 5 },
                { header: "Order ID", key: "id", width: 10 },
                { header: "KOT Type", key: "ncType", width: 15 },
                { header: "Items Ordered", key: "orderItems", width: 35 },
                { header: "Order Notes", key: "orderNote", width: 20 },
                { header: "Booking ID", key: "bookingCode", width: 15 },
                { header: "Room No", key: "roomNumber", width: 10 },
                { header: "Guest Name", key: "guestName", width: 20 },
                { header: "Order Date & Time", key: "createdAt", width: 25 },
                { header: "Order Accepted", key: "orderAccepted", width: 25 },
                { header: "Order Deliver", key: "orderDelivered", width: 25 },
                { header: "Amount", key: "orderAmount", width: 10 },
                { header: "Order Status", key: "orderStatus", width: 15 },
            ];
            worksheet.getRow(1).eachCell(cell => {
                cell.font = { bold: true };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
            const statusMap = {
                0: "Pending",
                1: "In-Kitchen",
                2: "Ready to Deliver",
                3: "Delivered",
                4: "Cancelled",
            };
            orders.forEach((order, index) => {
                let creatorName = 'guest';
                if (order.userId != 0 && order.user?.name) {
                    creatorName = order.user.name;
                } else if ((!order.userId || order.userId === 0) && (order.createdByUser?.firstName || order.createdByUser?.lastName)) {
                    creatorName = `${order.createdByUser?.firstName || ''} ${order.createdByUser?.lastName || ''}`.trim();
                }
                let orderItemsStr = '';
                try {
                    const items = JSON.parse(order.orderItems || '[]');
                    orderItemsStr = items
                        .map(item => `${item.name}(${item.qty})`)
                        .join(',');
                } catch (e) {
                    console.error('Invalid JSON in orderItems:', order.orderItems);
                    orderItemsStr = '';
                }
                worksheet.addRow({
                    sn: index + 1,
                    id: order.id,
                    ncType: order.ncType,
                    orderItems: orderItemsStr,
                    orderNote: order.orderNote || '',
                    bookingCode: order.BookingHotel?.bookingCode || '-',
                    roomNumber: order.BookingHotel?.assignRoomNo || '-',
                    guestName: order.BookingHotel?.otherPersonName || '-',
                    createdAt: `${formatDate(order.createdAt)} - ${creatorName}`,
                    orderAccepted: order.acceptedAt
                        ? `${formatDate(order.acceptedAt)} - ${order.acceptedByUser?.firstName || ''}`
                        : '',
                    orderDelivered: order.deliveredAt
                        ? `${formatDate(order.deliveredAt)} - ${order.deliveredByUser?.firstName || ''}`
                        : '',
                    orderAmount: order.orderAmount,
                    orderStatus: statusMap[order.orderStatus] || 'Unknown',
                });
            });
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader("Content-Disposition", "attachment; filename=food_orders_report.xlsx");
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error("Export Error:", error);
            return res.status(400).json({ status: false, message: error.message });
        }
    },

    async foodOrderReportData(req, res, next) {
        try {
            const { propertyId, fromdate, todate, booking_id, orderId } = req.body;
            // const whereClause = {
            //     deletedAt: null,
            //     ...(fromdate && todate
            //         ? {
            //             createdAt: {
            //                 [Op.between]: [new Date(fromdate), new Date(todate)],
            //             },
            //         }
            //         : {}),
            //     ...(bookingId ? { bookingId } : {}),
            //     ...(orderId ? { id: orderId } : {}),
            // };
            let bookingId;
            if (booking_id) {
                const getData = await db.BookingHotel.findOne({ where: { bookingCode: booking_id } });
                bookingId = getData?.id;

                if (!bookingId) {
                    return res.status(404).json({ status: false, message: 'Booking not found' });
                }
            }

            const whereConditions = [{ deletedAt: null }];

            // OrderId + BookingId strict match logic
            if (orderId && bookingId) {
                whereConditions.push({ id: orderId });
                whereConditions.push({ bookingId: bookingId });
            } else if (orderId) {
                whereConditions.push({ id: orderId });
            } else if (bookingId) {
                whereConditions.push({ bookingId: bookingId });
            }
            if (propertyId) {
                whereConditions.push({ propertyId });
            }
            if (fromdate && todate) {
                whereConditions.push({
                    createdAt: {
                        [Op.between]: [new Date(fromdate), new Date(todate)],
                    },
                });
            }
            const whereClause = { [Op.and]: whereConditions };
            const orders = await db.FoodOrder.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.BookingHotel,
                        attributes: ['bookingCode', 'assignRoomNo', 'otherPersonName'],
                    },
                    {
                        model: db.PropertyUser,
                        as: 'acceptedByUser',
                        attributes: ['firstName', 'lastName'],
                    },
                    {
                        model: db.PropertyUser,
                        as: 'deliveredByUser',
                        attributes: ['firstName', 'lastName'],
                    },
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['name'],
                    },
                    {
                        model: db.PropertyUser,
                        as: 'createdByUser',
                        attributes: ['firstName', 'lastName'],
                    },
                ],
                order: [['createdAt', 'DESC']],
                raw: true,
                nest: true,
            });
            const statusMap = {
                0: "Pending",
                1: "In-Kitchen",
                2: "Ready to Deliver",
                3: "Delivered",
                4: "Cancelled",
            };
            const reportData = orders.map((order, index) => {
                const creatorName =
                    order.user?.name ||
                    [order.createdByUser?.firstName, order.createdByUser?.lastName].filter(Boolean).join(' ') ||
                    'guest';
                let orderItemsStr = '';
                try {
                    const items = JSON.parse(order.orderItems || '[]');
                    orderItemsStr = items
                        .map(item => `${item.name}(${item.qty})`)
                        .join(',');
                } catch (e) {
                    console.error('Invalid JSON in orderItems:', order.orderItems);
                    orderItemsStr = '';
                }
                return {
                    sn: index + 1,
                    id: order.id,
                    ncType: order.ncType,
                    orderItems: orderItemsStr,
                    orderNote: order.orderNote || '',
                    bookingCode: order.BookingHotel?.bookingCode || '-',
                    roomNumber: order.BookingHotel?.assignRoomNo || '-',
                    guestName: order.BookingHotel?.otherPersonName || '-',
                    createdAt: `${formatDate(order.createdAt)} - ${creatorName}`,
                    orderAccepted: order.acceptedAt
                        ? `${formatDate(order.acceptedAt)} - ${order.acceptedByUser?.firstName || ''}`
                        : '',
                    orderDelivered: order.deliveredAt
                        ? `${formatDate(order.deliveredAt)} - ${order.deliveredByUser?.firstName || ''}`
                        : '',
                    orderAmount: order.orderAmount,
                    orderStatus: statusMap[order.orderStatus] || 'Unknown',
                };
            });
            return res.status(200).json({
                status: true,
                message: "Food order report data fetched successfully",
                data: reportData,
            });
        } catch (error) {
            console.error("Report Data Error:", error);
            return res.status(400).json({ status: false, message: error.message });
        }
    },

    async foodPaymentReportData(req, res) {
        try {
            const {
                propertyId, booking_id, orderId, fromdate, todate,
                page = 1, limit = 50 // ✅ Default pagination values
            } = req.body;

            let bookingId;
            if (booking_id) {
                const getData = await db.BookingHotel.findOne({ where: { bookingCode: booking_id } });
                bookingId = getData?.id;
                if (!bookingId) {
                    return res.status(404).json({ status: false, message: 'Booking not found' });
                }
            }

            const whereConditions = [{ deletedAt: null }];

            if (orderId && bookingId) {
                whereConditions.push({ id: orderId });
                whereConditions.push({ bookingId });
            } else if (orderId) {
                whereConditions.push({ id: orderId });
            } else if (bookingId) {
                whereConditions.push({ bookingId });
            }
            if (propertyId) {
                whereConditions.push({ propertyId });
            }
            if (fromdate && todate) {
                whereConditions.push({
                    createdAt: {
                        [Op.between]: [new Date(fromdate), new Date(todate)],
                    },
                });
            }

            const whereClause = { [Op.and]: whereConditions };

            // ✅ Get total count before applying pagination
            const totalCount = await db.FoodOrderPayment.count({ where: whereClause });

            // ✅ Apply offset and limit for pagination
            const payments = await db.FoodOrderPayment.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.FoodOrder,
                        as: 'orderByOrderId',
                        attributes: ['id', 'bookingId', 'orderAmount', 'ncType', 'discountPercentage'],
                        required: false
                    },
                    {
                        model: db.FoodOrder,
                        as: 'orderByBookingId',
                        attributes: ['id', 'bookingId', 'orderAmount', 'ncType', 'discountPercentage'],
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']],
                offset: (page - 1) * limit,
                limit: parseInt(limit)
            });

            let report = [];
            let sn = (page - 1) * limit + 1; // ✅ Maintain global SN
            const paymentGroups = {};

            for (const payment of payments.reverse()) {
                const key = payment.orderId && payment.orderId !== 0 ? `order-${payment.orderId}` : `booking-${payment.bookingId}`;
                if (!paymentGroups[key]) paymentGroups[key] = [];
                paymentGroups[key].push(payment);
            }

            for (const groupKey of Object.keys(paymentGroups)) {
                const paymentList = paymentGroups[groupKey];
                let order = null;
                let orderAmount = 0;
                let discountPercent = 0;
                let kotType = '';
                let bookingId = null;
                let orderId = null;

                const firstPayment = paymentList[0];
                bookingId = firstPayment.bookingId;
                orderId = firstPayment.orderId;

                if (orderId && orderId !== 0) {
                    order = await db.FoodOrder.findOne({
                        where: { id: orderId, deletedAt: null },
                        attributes: ['id', 'bookingId', 'orderAmount', 'ncType', 'discountPercentage']
                    });
                    if (!order) continue;
                    orderAmount = order.orderAmount;
                    discountPercent = order.discountPercentage || 0;
                    kotType = order.ncType;
                    bookingId = order.bookingId;
                } else if (bookingId && bookingId !== 0) {
                    const orders = await db.FoodOrder.findAll({
                        where: { bookingId, deletedAt: null },
                        attributes: ['orderAmount', 'ncType', 'discountPercentage']
                    });
                    if (!orders.length) continue;
                    orderAmount = orders.reduce((sum, ord) => sum + (ord.orderAmount || 0), 0);
                    discountPercent = orders[0].discountPercentage || 0;
                    kotType = orders[0].ncType;
                } else {
                    continue;
                }

                const discount = firstPayment.totalDiscountAmount ?? ((orderAmount * discountPercent) / 100);
                let paidTillNow = 0;
                for (const payment of paymentList) {
                    paidTillNow += payment.paymentAmount || 0;
                    const balance = orderAmount - paidTillNow - discount;
                    report.push({
                        SN: sn++,
                        orderId: orderId || '-',
                        bookingId,
                        kotType,
                        paymentDateTime: payment.createdAt,
                        amount: orderAmount,
                        discount: discount,
                        paymentAmount: payment.paymentAmount,
                        paymentMode: getPaymentModeName(payment.paymentMode),
                        transactionId: payment.transactionId || '-',
                        paymentStatus: balance === 0 ? 'Paid' : 'Pending',
                        balance: balance
                    });
                }
            }

            let NewFirst = report.reverse();

            // ✅ Return with pagination metadata
            return res.json({
                status: true,
                message: "Food payment report fetched successfully",
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount: totalCount,
                data: NewFirst
            });
        } catch (error) {
            console.error('Error generating food order payment report:', error);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
    },

    async foodPaymentReportExport(req, res) {
        try {
            const { propertyId, booking_id, orderId, fromdate, todate } = req.body;
            let bookingId;
            if (booking_id) {
                const getData = await db.BookingHotel.findOne({ where: { bookingCode: booking_id } });
                bookingId = getData?.id;
                if (!bookingId) {
                    return res.status(404).json({ status: false, message: 'Booking not found' });
                }
            }
            const whereConditions = [{ deletedAt: null }];
            // OrderId + BookingId strict match logic
            if (orderId && bookingId) {
                whereConditions.push({ id: orderId });
                whereConditions.push({ bookingId: bookingId });
            } else if (orderId) {
                whereConditions.push({ id: orderId });
            } else if (bookingId) {
                whereConditions.push({ bookingId: bookingId });
            }
            if (propertyId) {
                whereConditions.push({ propertyId });
            }
            if (fromdate && todate) {
                whereConditions.push({
                    createdAt: {
                        [Op.between]: [new Date(fromdate), new Date(todate)],
                    },
                });
            }
            const whereClause = { [Op.and]: whereConditions };
            const payments = await db.FoodOrderPayment.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.FoodOrder,
                        as: 'orderByOrderId',
                        attributes: ['id', 'bookingId', 'orderAmount', 'ncType', 'discountPercentage'],
                        required: false
                    },
                    {
                        model: db.FoodOrder,
                        as: 'orderByBookingId',
                        attributes: ['id', 'bookingId', 'orderAmount', 'ncType', 'discountPercentage'],
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            let report = [];
            let sn = 1;
            const paymentGroups = {};
            for (const payment of payments.reverse()) {
                const key = payment.orderId && payment.orderId !== 0 ? `order-${payment.orderId}` : `booking-${payment.bookingId}`;
                if (!paymentGroups[key]) paymentGroups[key] = [];
                paymentGroups[key].push(payment);
            }
            for (const groupKey of Object.keys(paymentGroups)) {
                const paymentList = paymentGroups[groupKey];
                let order = null;
                let orderAmount = 0;
                let discountPercent = 0;
                let kotType = '';
                let bookingId = null;
                let orderId = null;
                const firstPayment = paymentList[0];
                bookingId = firstPayment.bookingId;
                orderId = firstPayment.orderId;
                if (orderId && orderId !== 0) {
                    order = await db.FoodOrder.findOne({
                        where: { id: orderId, deletedAt: null },
                        attributes: ['id', 'bookingId', 'orderAmount', 'ncType', 'discountPercentage']
                    });
                    if (!order) continue;
                    orderAmount = order.orderAmount;
                    discountPercent = order.discountPercentage || 0;
                    kotType = order.ncType;
                    bookingId = order.bookingId;
                } else if (bookingId && bookingId !== 0) {
                    const orders = await db.FoodOrder.findAll({
                        where: { bookingId, deletedAt: null },
                        attributes: ['orderAmount', 'ncType', 'discountPercentage']
                    });
                    if (!orders.length) continue;
                    orderAmount = orders.reduce((sum, ord) => sum + (ord.orderAmount || 0), 0);
                    discountPercent = orders[0].discountPercentage || 0;
                    kotType = orders[0].ncType;
                } else {
                    continue;
                }
                const discount = firstPayment.totalDiscountAmount ?? ((orderAmount * discountPercent) / 100);
                let paidTillNow = 0;
                for (const payment of paymentList) {
                    paidTillNow += payment.paymentAmount || 0;
                    const balance = orderAmount - paidTillNow - discount;
                    report.push({
                        SN: sn++,
                        orderId: orderId || '-',
                        bookingId,
                        kotType,
                        paymentDateTime: payment.createdAt,
                        amount: orderAmount,
                        discount,
                        paymentAmount: payment.paymentAmount,
                        paymentMode: getPaymentModeName(payment.paymentMode),
                        transactionId: payment.transactionId || '-',
                        paymentStatus: balance === 0 ? 'Paid' : 'Pending',
                        balance
                    });
                }
            }
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Food Payment Report');
            sheet.columns = [
                { header: 'SN.', key: 'SN', width: 5 },
                { header: 'Order ID', key: 'orderId', width: 10 },
                { header: 'BookingID', key: 'bookingId', width: 15 },
                { header: 'KOT Type', key: 'kotType', width: 15 },
                { header: 'Payment Date & Time', key: 'paymentDateTime', width: 20 },
                { header: 'Amount', key: 'amount', width: 10 },
                { header: 'Discount', key: 'discount', width: 10 },
                { header: 'Payment Amount', key: 'paymentAmount', width: 15 },
                { header: 'Payment Mode', key: 'paymentMode', width: 15 },
                { header: 'Transaction ID / Ref', key: 'transactionId', width: 25 },
                { header: 'Payment Status', key: 'paymentStatus', width: 15 },
                { header: 'Balance', key: 'balance', width: 10 }
            ];
            sheet.addRows(report.reverse());
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=food-payment-report.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error generating food order payment report:', error);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
    },

    async transactionReportData(req, res) {
        try {
            const { bookingCode, fromdate, todate, merchantTransactionId, page = 1, limit = 50 } = req.body;
            const whereConditions = [{ deletedAt: null }];
            // Filter by bookingCode
            let bookingWhere = {};
            if (bookingCode) {
                bookingWhere.bookingCode = bookingCode;
            }
            if (merchantTransactionId) {
                whereConditions.push({ merchantTransactionId });
            }
            // Filter by createdAt date range
            if (fromdate && todate) {
                whereConditions.push({
                    createdAt: {
                        [Op.between]: [new Date(fromdate), new Date(todate)],
                    },
                });
            }
            const offset = (page - 1) * limit;
            const { rows, count } = await db.Transaction.findAndCountAll({
                where: { [Op.and]: whereConditions },
                attributes: [
                    'id',
                    'bookingId',
                    'amount',
                    'status',
                    'merchantTransactionId',
                    'merchantUserId',
                    'request',
                    'response',
                    'createdAt'
                ],
                include: [
                    {
                        model: db.BookingHotel,
                        attributes: ['bookingCode', 'userId', 'propertyId', 'fromDate', 'toDate', 'noOfRooms', 'adults', 'paymentMode', 'PaymentStatus', 'bookingStatus', 'bookingAmout', 'dueAmount', 'otherPersonName', 'otherPersonNumber', 'createdAt'],
                        where: bookingWhere, // filter by bookingCode if provided
                        include: [
                            {
                                model: db.User,
                                attributes: ['name', 'email', 'mobile'],
                                required: false
                            },
                            {
                                model: db.PropertyMaster,
                                attributes: ['name','propertyCode'],
                                required: false
                            }
                        ],
                        required: true
                    }
                ],
                order: [['createdAt', 'DESC']],
                offset,
                limit: parseInt(limit),
            });
            return res.json({
                status: true,
                data: rows,
                pagination: {
                    totalRecords: count,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                },
            });
        } catch (error) {
            console.error('Error generating transaction report:', error);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
    },

    async transactionReportExport(req, res) {
        try {
            const { bookingCode, fromdate, todate } = req.body;
            const whereConditions = [{ deletedAt: null }];
            let bookingWhere = {};
            if (bookingCode) {
                bookingWhere.bookingCode = bookingCode;
            }
            if (fromdate && todate) {
                whereConditions.push({
                    createdAt: {
                        [Op.between]: [new Date(fromdate), new Date(todate)],
                    },
                });
            }
            const transactions = await db.Transaction.findAll({
                where: { [Op.and]: whereConditions },
                attributes: [
                    'id',
                    'bookingId',
                    'amount',
                    'status',
                    'merchantTransactionId',
                    'merchantUserId',
                    'request',
                    'response',
                    'createdAt'
                ],
                include: [
                    {
                        model: db.BookingHotel,
                        attributes: ['bookingCode'],
                        where: bookingWhere,
                        required: true
                    }
                ],
                order: [['createdAt', 'DESC']],
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Transaction Report');
            worksheet.columns = [
                { header: 'S.No', key: 'sn', width: 6 },
                { header: 'Booking ID', key: 'bookingId', width: 20 },
                { header: 'Booking Code', key: 'bookingCode', width: 20 },
                { header: 'Amount', key: 'amount', width: 10 },
                { header: 'Status', key: 'status', width: 10 },
                { header: 'Merchant Txn ID', key: 'merchantTransactionId', width: 30 },
                { header: 'Merchant User ID', key: 'merchantUserId', width: 25 },
                { header: 'Created At', key: 'createdAt', width: 20 },
                { header: 'Request', key: 'request', width: 50 },
                { header: 'Response', key: 'response', width: 50 },
            ];
            worksheet.autoFilter = {
                from: 'A1',
                to: 'J1'
            };
            worksheet.getRow(1).eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '000000' },
                };
                cell.font = {
                    color: { argb: 'FFFFFF' },
                    bold: true,
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
            transactions.forEach((txn, index) => {
                let parsedRequest = '';
                let parsedResponse = '';
                try {
                    parsedRequest = JSON.stringify(JSON.parse(txn.request || '{}'), null, 2);
                } catch (e) {
                    parsedRequest = txn.request || '';
                }
                try {
                    parsedResponse = JSON.stringify(JSON.parse(txn.response || '{}'), null, 2);
                } catch (e) {
                    parsedResponse = txn.response || '';
                }
                const createdAtFormatted = txn.createdAt
                    ? txn.createdAt.toISOString().slice(0, 19).replace('T', ' ')
                    : '';
                worksheet.addRow({
                    sn: index + 1,
                    bookingId: txn.bookingId,
                    bookingCode: txn.BookingHotel?.bookingCode || '',
                    amount: txn.amount,
                    status: txn.status == 1 ? 'Pending' : 'Success',
                    merchantTransactionId: txn.merchantTransactionId,
                    merchantUserId: txn.merchantUserId,
                    request: parsedRequest,
                    response: parsedResponse,
                    createdAt: createdAtFormatted
                });
            });
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=transaction_report_${Date.now()}.xlsx`
            );
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error exporting transaction report:', error);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
    }
};

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function getPaymentModeName(mode) {
    const m = Number(mode);
    switch (m) {
        case 2: return 'Cash';
        case 5: return 'UPI';
        case 3: return 'Card';
        default:
            console.warn('Unknown payment mode:', mode);
            return 'Other';
    }
}
