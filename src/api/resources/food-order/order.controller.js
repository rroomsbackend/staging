import { CanceledError } from 'axios';
import { db } from '../../../models';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import moment from 'moment';
import admin from '../../../firebase-admin-config'

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

const arrayColumn = (arr, n) => arr.map(x => x[n]);

export default {
    async create(req, res, next) {
        const { user_id, booking_id, propertyId, room_number, order_amount, discountPercentage, order_items, order_note, nc_type, otherGuestName, remark, created_by, totalFoodAmountBeforeGST, waiterID } = req.body;
        try {
            // const User = await db.User.findOne({ where: { id: user_id, deletedAt: null } });
            // if (!User) {
            //     validationResponse("Invalid user_id");
            // }
            /*if (booking_id) {
                const bookingHotel = await db.BookingHotel.findOne({ where: { id: booking_id, deletedAt: null } })
                if (!bookingHotel) {
                    validationResponse("Invalid booking_id");
                }else{
                    if(order_amount && order_amount > 0)
                        bookingHotel.update({totalFoodAmount: order_amount + bookingHotel.get('totalFoodAmount')})
                }
            }*/
            let finalOrderItems = [];
            const menuItem = await db.FoodMenuItem.findAll({ where: { id: arrayColumn(order_items, "id"), deletedAt: null } })
            if (!menuItem.length) {
                validationResponse("No menu item found");
            }
            // else {
            //     menuItem.map((item) => {
            //         order_items.forEach(orderItem => {
            //             if (orderItem.id == item.id) {
            //                 item.qty = orderItem.qty;
            //                 item.totalAmount = item.price * orderItem.qty;
            //             }
            //         });
            //         finalOrderItems = [...finalOrderItems, {
            //             "id": item.id,
            //             "name": item.name,
            //             "price": item.price,
            //             "qty": item.qty,
            //             "totalAmount": item.totalAmount,
            //             "amountBeforeTax":item.amountBeforeTax,
            //             "taxAmount":item.taxAmount,
            //             "categoryId": item.categoryId,
            //             "propertyId": item.propertyId
            //         }];
            //     });
            //     return;
            // }
            await db.FoodOrder.create({ userId: user_id, bookingId: booking_id, propertyId: propertyId, roomNumber: room_number, orderAmount: order_amount, discountPercentage: discountPercentage, orderNote: order_note, ncType: nc_type, otherGuestName: otherGuestName, orderItems: order_items, remark: remark, createdBy: created_by, totalFoodAmountBeforeGST: totalFoodAmountBeforeGST, dueAmount: order_amount, waiterID: waiterID })
                .then(async result => {
                    // const waiter = await db.PropertyUser.findOne({ where: { id: waiterID } });
                    // if (waiter?.fcmToken) {
                    //     try {
                    //         await admin.messaging().send({
                    //             notification: {
                    //                 title: "RROOMS: New Order Alert",
                    //                 body: `A new food order has been placed. Please check the details.`,
                    //             },
                    //             token: waiter.fcmToken
                    //         });
                    //     } catch (err) {
                    //         if (err.code === 'messaging/registration-token-not-registered') {
                    //             await db.PropertyUser.update(
                    //                 { fcmToken: null },
                    //                 { where: { id: waiterID } }
                    //             );
                    //             console.warn(`⚠️ Invalid token removed for waiter ID: ${waiterID}`);
                    //         } else {
                    //             console.error("❌ Failed to send to waiter:", err.message);
                    //         }
                    //     }
                    // } else {
                    //     console.log("⚠️ FCM token not found for user ID:", waiterID);
                    // }
                    const users = await db.PropertyUser.findAll({
                        where: {
                            role: 3,
                            fcmToken: { [db.Sequelize.Op.ne]: null },
                            propertyId: propertyId
                        }
                    });
                    const tokens = users.map(u => u.fcmToken).filter(Boolean);
                    if (tokens.length > 0) {
                        const multicastResponse = await admin.messaging().sendEachForMulticast({
                            notification: {
                                title: "RROOMS: New Order Alert",
                                body: "A new food order has been placed. Please check the details.",
                            },
                            tokens
                        });
                        const failedTokens = [];
                        multicastResponse.responses.forEach((resp, idx) => {
                            if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
                                failedTokens.push(tokens[idx]);
                            }
                        });
                        if (failedTokens.length > 0) {
                            await db.PropertyUser.update(
                                { fcmToken: null },
                                { where: { fcmToken: failedTokens } }
                            );
                            console.warn(`⚠️ Removed ${failedTokens.length} invalid multicast FCM tokens.`);
                        }
                        console.log(`✅ Multicast sent: ${multicastResponse.successCount}/${tokens.length}`);
                    } else {
                        console.log("❌ No valid FCM tokens for role = 7");
                    }
                    return res.status(200).json({ status: true, data: result, message: "Order created successfully" });
                }).catch(err => {
                    console.log(err);
                    return res.status(400).json({ status: false, message: err.message });
                });
        } catch (error) {
            console.log("error - ", error);
            return res.status(error?.code ? error.code : 500).json({
                status: false,
                msg: error?.message
            });
        }
    },

    async update(req, res, next) {
        const { user_id, booking_id, propertyId, room_number, order_amount, order_note, nc_type, otherGuestName, order_items, remark, created_by, totalFoodAmountBeforeGST, dueAmount, waiterID } = req.body;
        try {
            // const User = await db.User.findOne({ where: { id: user_id, deletedAt: null } });
            // if (!User) {
            //     validationResponse("Invalid user_id");
            // }
            if (booking_id) {
                const bookingHotel = await db.BookingHotel.findOne({ where: { id: booking_id, deletedAt: null } })
                if (!bookingHotel) {
                    validationResponse("Invalid booking_id");
                } else {
                    //if(order_amount && order_amount > 0)
                    // bookingHotel.update({totalFoodAmount: order_amount + bookingHotel.get('totalFoodAmount')})
                }
            }
            let finalOrderItems = [];
            const menuItem = await db.FoodMenuItem.findAll({ where: { id: arrayColumn(order_items, "id"), deletedAt: null } })
            if (!menuItem.length) {
                validationResponse("No menu item found");
            }/* else {
                menuItem.map((item) => {
                    // order_items.forEach(orderItem => {
                    //     if (orderItem.id == item.id) {
                    //         item.qty = orderItem.qty;
                    //         item.totalAmount = item.price * orderItem.qty;
                    //     }
                    // });
                    finalOrderItems = [...finalOrderItems, {
                        "id": item.id,
                        "name": item.name,
                        "price": item.price,
                        "qty": item.qty,
                        "totalAmount": item.totalAmount,
                        "amountBeforeTax":item.amountBeforeTax,
                        "taxAmount":item.taxAmount,
                        //"categoryId": item.categoryId,
                        "propertyId": item.propertyId
                    }];
                });
                let prices = arrayColumn(menuItem, "totalAmount");
                let totalPrice = prices.reduce((a, b) => a + b, 0);
                // if (totalPrice != order_amount) {
                //     validationResponse("Order amount not matched with menu items total price");
                // }
            }*/
            const order = await db.FoodOrder.findOne({ where: { id: req.params.id, deletedAt: null } })
            if (!order) {
                validationResponse("Invalid order");
            }
            await db.FoodOrder.update({ userId: user_id, bookingId: booking_id, propertyId: propertyId, roomNumber: room_number, orderAmount: order_amount, orderNote: order_note, ncType: nc_type, otherGuestName: otherGuestName, orderItems: order_items, remark: remark, createdBy: created_by, totalFoodAmountBeforeGST: totalFoodAmountBeforeGST, dueAmount: dueAmount, waiterID: waiterID }, { where: { id: req.params.id, deletedAt: null } })
                .then(async result => {
                    const totalFoodOrderUpdatedAmount = await db.FoodOrder.findAll({ where: { bookingId: booking_id, orderStatus: [1, 2, 3] }, attributes: ["bookingId", [Sequelize.fn('sum', Sequelize.col('orderAmount')), 'totalOrderAmount'], [Sequelize.fn('sum', Sequelize.col('paidAmount')), 'totalPaidAmount']], group: ['bookingId'] })
                    if (totalFoodOrderUpdatedAmount) {
                        // await db.BookingHotel.update({ totalFoodAmount: totalFoodOrderUpdatedAmount[0]?.get('totalOrderAmount'), collectedFoodAmout: totalFoodOrderUpdatedAmount[0]?.get('totalPaidAmount') }, { where: { id: booking_id } }) // comment on 04-06-2025 for food order payement collect
                        await db.BookingHotel.update({ totalFoodAmount: totalFoodOrderUpdatedAmount[0]?.get('totalOrderAmount') }, { where: { id: booking_id } })
                    }
                    return res.status(200).json({ status: true, data: result, message: "Order updated successfully" });
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

    // commented on 27-06-2025 add key totalFoodAmountBeforeGST update in booking_hotel table
    // async updateStatus(req, res, next) {
    //     const { id } = req.params;
    //     const { payment_status, order_status } = req.body;
    //     try {
    //         const order = await db.FoodOrder.findOne({ where: { id: id, deletedAt: null } })
    //         if (!order) {
    //             validationResponse("Invalid order");
    //         }
    //         await db.FoodOrder.update({
    //             paymentStatus: payment_status ? payment_status : order.paymentStatus,
    //             orderStatus: order_status ? order_status : order.orderStatus
    //         }, { where: { id: id, deletedAt: null } })
    //             .then(async result => {
    //                 if (order_status == 1 || order_status == 4) {
    //                     await db.BookingHotel.findOne({ where: { id: order.bookingId } }).then(booking => {
    //                         if (booking) {
    //                             let totalFoodOrderAmount = booking.get('totalFoodAmount') && booking.get('totalFoodAmount') > 0 ? booking.get('totalFoodAmount') : 0;
    //                             let orderAmount = order.orderAmount && order.orderAmount > 0 ? order.orderAmount : 0;
    //                             if (order_status == 1) {
    //                                 totalFoodOrderAmount = totalFoodOrderAmount + orderAmount
    //                             } else {
    //                                 if (totalFoodOrderAmount >= orderAmount) {
    //                                     totalFoodOrderAmount = totalFoodOrderAmount - orderAmount;
    //                                 } else {
    //                                     totalFoodOrderAmount = 0;
    //                                 }
    //                             }
    //                             const dueA = booking.dueFoodAmount + orderAmount;
    //                             if (!(order.orderStatus == 1 && order_status == 1)) {
    //                                 booking.update({ totalFoodAmount: totalFoodOrderAmount, dueFoodAmount: dueA, totalFoodAmountBeforeGST: totalFoodAmountBeforeGST });
    //                             }
    //                         }
    //                     })
    //                 }
    //                 return res.status(200).json({ status: true, data: result, msg: "Order updated successfully" });
    //             }).catch(err => {
    //                 return res.status(400).json({ status: false, message: err.message });
    //             });
    //     } catch (error) {
    //         return res.status(error?.code ? error.code : 500).json({
    //             status: false,
    //             msg: error?.message
    //         });
    //     }
    // },

    async updateStatus(req, res, next) {
        const { id } = req.params;
        const { payment_status, order_status, deliveredBy, acceptedBy, rejectedBy } = req.body;
        console.log("updateStatus-id - ", id);
        try {
            const order = await db.FoodOrder.findOne({ where: { id: id, deletedAt: null } });
            if (!order) {
                return validationResponse("Invalid order");
            }
            const currentTime = new Date().toLocaleString('sv-SE', {
                timeZone: 'Asia/Kolkata',
                hour12: false
            });
            const updateData = {
                paymentStatus: payment_status ?? order.paymentStatus,
                orderStatus: order_status ?? order.orderStatus,
            };
            if (!order.acceptedBy && acceptedBy) {
                updateData.acceptedBy = acceptedBy;
                updateData.acceptedAt = currentTime;
            }
            if (!order.deliveredBy && deliveredBy) {
                updateData.deliveredBy = deliveredBy;
                updateData.deliveredAt = currentTime;
            }
            if (!order.rejectedBy && rejectedBy) {
                updateData.rejectedBy = rejectedBy;
                updateData.rejectedAt = currentTime;
            }
            await db.FoodOrder.update(updateData, { where: { id: id, deletedAt: null } });
            if (order_status == 1 || order_status == 4) {
                const booking = await db.BookingHotel.findOne({ where: { id: order.bookingId } });
                if (booking) {
                    let totalFoodAmount = booking.totalFoodAmount ?? 0;
                    let dueA = booking?.dueFoodAmount ?? 0;
                    let totalFoodAmountBeforeGST = booking.totalFoodAmountBeforeGST ?? 0;
                    let orderAmount = order.orderAmount ?? 0;
                    let orderAmountBeforeGST = order.totalFoodAmountBeforeGST ?? 0;
                    let collectedAmut = booking?.collectedFoodAmout ?? 0
                    if (order_status == 1) {
                        // totalFoodAmount += orderAmount;
                        // totalFoodAmountBeforeGST += orderAmountBeforeGST;
                        // dueA = booking.dueFoodAmount + orderAmount;
                        totalFoodAmount += orderAmount;
                        totalFoodAmountBeforeGST += orderAmountBeforeGST;
                        let w = totalFoodAmountBeforeGST - booking.discountOnFood;
                        let x = w * 5 / 100;
                        let y = w + x - (booking?.collectedFoodAmout || 0);
                        dueA = booking?.discountOnFood == 0 || booking?.foodDiscountPercentage == 0 ? totalFoodAmount - collectedAmut : Math.round(y);
                    } else if (order_status == 4) {
                        totalFoodAmount = Math.max(0, totalFoodAmount - orderAmount);
                        dueA = booking.dueFoodAmount - orderAmount;
                        totalFoodAmountBeforeGST = Math.max(0, totalFoodAmountBeforeGST - orderAmountBeforeGST);
                    }
                    if (!(order.orderStatus == 1 && order_status == 1)) {
                        await booking.update({
                            totalFoodAmount,
                            dueFoodAmount: dueA,
                            totalFoodAmountBeforeGST
                        });
                    }
                }
            }
            res.status(200).json({ status: true, msg: "Order updated successfully" });
            (async () => {
                try {
                    const waiter = await db.PropertyUser.findOne({ where: { id: order.waiterID } });
                    const users = await db.PropertyUser.findAll({
                        where: {
                            role: 22,
                            fcmToken: { [db.Sequelize.Op.ne]: null },
                            propertyId: order.propertyId
                        }
                    });
                    const tokens = users.map(u => u.fcmToken).filter(Boolean);
                    const cleanInvalidTokens = async (failedTokens) => {
                        if (failedTokens.length > 0) {
                            await db.PropertyUser.update(
                                { fcmToken: null },
                                { where: { fcmToken: failedTokens } }
                            );
                            console.warn(`⚠️ Removed ${failedTokens.length} invalid FCM tokens.`);
                        }
                    };
                    const sendToWaiter = async (title, body) => {
                        if (waiter?.fcmToken) {
                            try {
                                await admin.messaging().send({
                                    notification: { title, body },
                                    token: waiter.fcmToken
                                });
                            } catch (err) {
                                if (err.code === 'messaging/registration-token-not-registered') {
                                    await db.PropertyUser.update(
                                        { fcmToken: null },
                                        { where: { id: waiter.id } }
                                    );
                                    console.warn(`⚠️ Invalid token removed for waiter ID: ${waiter.id}`);
                                } else {
                                    console.error("❌ Failed to send to waiter:", err.message);
                                }
                            }
                        } else {
                            console.log("⚠️ FCM token not found for waiter ID:", order.waiterID);
                        }
                    };
                    const sendToMultiple = async (title, body) => {
                        if (tokens.length > 0) {
                            const response = await admin.messaging().sendEachForMulticast({
                                notification: { title, body },
                                tokens
                            });
                            const failedTokens = [];
                            response.responses.forEach((resp, idx) => {
                                if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
                                    failedTokens.push(tokens[idx]);
                                }
                            });
                            await cleanInvalidTokens(failedTokens);
                            console.log(`✅ Multicast sent: ${response.successCount}/${tokens.length}`);
                        } else {
                            console.log("❌ No valid FCM tokens for role = 3");
                        }
                    };
                    console.log("order_status - ", order_status);
                    if (order_status == 2) {
                        await sendToWaiter("RROOMS: Order Ready", "Delivered the food.");
                        // await sendToMultiple("RROOMS: Order Confirmed", "A food order has been confirmed. Please check availability of waiter.");
                    } else if (order_status == 3) {
                        await sendToWaiter("RROOMS: Order Delivered", "The food order has been Delivered.");
                        await sendToMultiple("RROOMS: Order Delivered", "The food order has been Delivered successfully.");
                    } else if (order_status == 4) {
                        console.log("order_status - ", order_status);
                        await sendToWaiter("RROOMS: Order Cancelled", "Food order has been cancelled.");
                        await sendToMultiple("RROOMS: Order Cancelled", "A food order has been cancelled.");
                    }
                } catch (err) {
                    console.error("❌ Error in FCM notification block:", err.message);
                }
            })();
        } catch (error) {
            return res.status(error?.code ?? 500).json({
                status: false,
                msg: error?.message
            });
        }
    },

    async get(req, res) {
        try {
            const { booking_id, date } = req.query;
            const selection = {
                order: [
                    ['id', 'DESC'],
                    ['updatedAt', 'DESC']
                ],
                include: [
                    {
                        attributes: ['id', 'bookingCode'],
                        model: db.BookingHotel,
                        required: false
                    }
                ],
                where: [
                    { deletedAt: null }
                ],
            }
            if (booking_id && !date) {
                selection.where = [{
                    bookingId: booking_id,
                    deletedAt: null
                }];
            }
            if (!booking_id && date) {
                const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                if (!dateRegex.test(date)) {
                    validationResponse("Invalid date format. e.g: 'YYYY-MM-DD'");
                }
                selection.where = [{
                    deletedAt: null,
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '=', date)
                    ]
                }];
            }
            if (booking_id && date) {
                const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                if (!dateRegex.test(date)) {
                    validationResponse("Invalid date format. e.g: 'YYYY-MM-DD'");
                }
                selection.where = [{
                    bookingId: booking_id,
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '=', date)
                    ],
                    deletedAt: null
                }];
            }
            const selector = Object.assign({}, selection);
            await db.FoodOrder.findAll(selector)
                .then(result => {
                    return res.status(200).json({ data: result, status: true });
                }).catch((err) => {
                    return res.status(500).json({ status: false, message: err.message });
                })
        } catch (error) {
            return res.status(error?.code ? error.code : 500).json({
                status: false,
                msg: error?.message
            });
        }
    },

    async getById(req, res) {
        const id = req.params.id;
        db.FoodOrder.findOne({ where: { id: id } })
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async getByBookingId(req, res) {
        //const propertyId = req.params.propertyId;
        const bookingId = req.params.id;
        const selection = {
            include: [
                {
                    attributes: ['id', 'bookingCode'],
                    model: db.BookingHotel,
                    required: false
                }
            ],
            where: [
                { deletedAt: null, bookingId: bookingId }
            ],
            attributes: ['id', 'userId', 'bookingId', 'roomNumber', 'orderAmount', 'paidAmount', 'paymentStatus', 'orderStatus', 'ncType', 'orderItems', 'createdAt', 'acceptedBy', 'deliveredBy']
        }

        db.FoodOrder.findAll(selection)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            })
    },

    // async getByPropertyId(req, res) {
    //     const propertyId = req.params.id;
    //     const bookingId = await db.BookingHotel.findAll({ attributes: ['id'], where: { propertyId: propertyId, bookingStatus: [1, 2, 3, 4] } }).map(u => u.get("id"));
    //     const selection = {
    //         include: [
    //             {
    //                 attributes: ['id', 'bookingCode', 'otherPersonName', 'otherPersonNumber'],
    //                 model: db.BookingHotel,
    //                 required: false
    //             }
    //         ],
    //         attributes: ['id', 'userId', 'bookingId', 'roomNumber', 'orderAmount', 'paidAmount', 'paymentStatus', 'orderStatus', 'orderNote', 'ncType', 'otherGuestName', 'orderItems', 'remark', 'createdBy', 'createdAt'],
    //         where: [
    //             { deletedAt: null, bookingId: bookingId }
    //         ],
    //     }
    //     if (bookingId && bookingId.length > 0) {
    //         db.FoodOrder.findAll(selection)
    //             .then(result => {
    //                 return res.status(200).json({ data: result, status: true });
    //             })
    //             .catch((err) => {
    //                 return res.status(400).json({ status: false, message: err.message });
    //             })
    //     } else {
    //         return res.status(204).json({ status: false, message: 'No food order avaiable by this property id' });
    //     }
    // },

    // comemted on 25-06-2025
    // async getByPropertyId(req, res) {
    //     const propertyId = req.params.id;
    //     try {
    //         const bookingIds = await db.BookingHotel.findAll({
    //             attributes: ['id'],
    //             where: {
    //                 propertyId: propertyId,
    //                 bookingStatus: [1, 2, 3, 4]
    //             }
    //         });
    //         const bookingIdList = bookingIds.map(u => u.get("id"));
    //         const selection = {
    //             include: [
    //                 {
    //                     attributes: ['id', 'bookingCode', 'otherPersonName', 'otherPersonNumber'],
    //                     model: db.BookingHotel,
    //                     required: false
    //                 }
    //             ],
    //             attributes: ['id', 'userId', 'bookingId', 'roomNumber', 'orderAmount', 'paidAmount', 'paymentStatus', 'orderStatus', 'orderNote', 'ncType', 'otherGuestName', 'orderItems', 'remark', 'createdBy', 'createdAt'],
    //             where: {
    //                 deletedAt: null,
    //                 ...(bookingIdList.length > 0 ? { bookingId: bookingIdList } : {}) // conditionally add bookingId
    //             },
    //             order: [['createdAt', 'ASC']]
    //         };
    //         const foodOrders = await db.FoodOrder.findAll(selection);
    //         return res.status(200).json({ data: foodOrders, status: true });
    //     } catch (err) {
    //         return res.status(500).json({ status: false, message: err.message });
    //     }
    // },

    async getByPropertyId(req, res) {
        const propertyId = req.params.id;
        try {
            const selection = {
                include: [
                    {
                        attributes: ['id', 'bookingCode', 'otherPersonName', 'otherPersonNumber', 'propertyId'],
                        model: db.BookingHotel,
                        required: false, // include even if no booking
                        where: {
                            [db.Sequelize.Op.or]: [
                                { propertyId: propertyId }, // match propertyId if booking exists
                                { propertyId: null }         // OR allow nulls
                            ],
                            bookingStatus: [1, 2, 3, 4]
                        }
                    }
                ],
                attributes: ['id', 'userId', 'bookingId', 'propertyId', 'roomNumber', 'orderAmount', 'paidAmount', 'paymentStatus', 'orderStatus', 'orderNote', 'ncType', 'otherGuestName', 'orderItems', 'remark', 'createdBy', 'createdAt', 'totalFoodAmountBeforeGST', 'discountPercentage', 'afterDiscount', 'dueAmount', 'waiterID'],
                where: {
                    propertyId: propertyId,
                    deletedAt: null
                },
                order: [['createdAt', 'ASC']]
            };
            const foodOrders = await db.FoodOrder.findAll(selection);
            return res.status(200).json({ data: foodOrders, status: true });
        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    },

    async delete(req, res, next) {
        const id = req.params.id;
        db.FoodOrder.findOne({ where: { id: id } })
            .then(result => {
                const bookingId = result?.get('bookingId')
                db.FoodOrder.destroy({ where: { id: req.params.id } }).then(async resu => {
                    if (result) {
                        const totalFoodOrderUpdatedAmount = await db.FoodOrder.findAll({ where: { bookingId: bookingId, status: [1, 2, 3] }, attributes: ["bookingId", [Sequelize.fn('sum', Sequelize.col('orderAmount')), 'totalOrderAmount'], [Sequelize.fn('sum', Sequelize.col('paidAmount')), 'totalPaidAmount']], group: ['bookingId'] })
                        if (totalFoodOrderUpdatedAmount) {
                            await db.BookingHotel.update({ totalFoodAmount: totalFoodOrderUpdatedAmount[0]?.get('totalOrderAmount'), collectedFoodAmout: totalFoodOrderUpdatedAmount[0]?.get('totalPaidAmount') }, { where: { id: bookingId } })
                        }
                        return res.status(200).json({ status: true, data: result });
                    } else
                        return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
                }).catch(err => {
                    return res.status(500).json({ status: false, message: err.message });
                })
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    }
};