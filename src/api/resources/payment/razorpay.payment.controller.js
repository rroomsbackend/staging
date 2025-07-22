import { db } from '../../../models';
import { bookingConfirmed } from '../sendOtp/sendOtpApis';
import paymentService from './payment.service';
import Razorpay from 'razorpay';
const crypto = require('crypto');

// razorpay test keys
// const keyID = 'rzp_test_58waWIEragQyMs';
// const keySECRET = '7upzHrID1L85k7XHDlzXvU5I';

// razorpay live keys
const keyID = 'rzp_live_Eqmw0XU2XIG31l';
const keySECRET = 'L6diUbo7CPzVt50xgziCWTTT';

const razorpay = new Razorpay({
    key_id: 'rzp_live_Eqmw0XU2XIG31l',
    key_secret: 'L6diUbo7CPzVt50xgziCWTTT'
    // key_id: 'rzp_test_58waWIEragQyMs',
    // key_secret: '7upzHrID1L85k7XHDlzXvU5I'
});

export default {
    async razorpayInitPayment(req, res, next) {
        try {
            const { booking_id, paymentType } = req.query;
            console.log({ booking_id, paymentType });
            if (!booking_id || !paymentType) {
                return res.status(400).json({ status: false, message: "Missing booking_id or paymentType" });
            }
            const bookingHotel = await db.BookingHotel.findOne({ where: { id: booking_id, deletedAt: null } });
            if (!bookingHotel) {
                paymentService.validationResponse("Invalid booking_id");
            }
            let amountToPay = bookingHotel.dueAmount;
            if (paymentType == "Partial") {
                amountToPay = (bookingHotel.bookingAmout * 0.25);
            }
            if (paymentType == "Full") {
                if (bookingHotel?.collectedPayment != null) {
                    amountToPay = (bookingHotel.dueAmount);
                } else {
                    amountToPay = (bookingHotel.bookingAmout);
                }
            }
            console.log("amountToPay -", amountToPay);
            const dueAmount = bookingHotel.dueAmount - amountToPay;
            const options = {
                amount: Math.round(amountToPay * 100), // amount in paise
                currency: "INR",
                receipt: `RROOMS_${Date.now()}`,
                notes: {
                    booking_id: booking_id,
                    paymentType: paymentType,
                    paidAmount: amountToPay,
                    dueAmount: dueAmount,
                    userId: bookingHotel.userId
                }
            };
            console.log("options -", options);
            const order = await razorpay.orders.create(options);
            console.log("order - ", order);

            // Save transaction details
            const transaction = await db.Transaction.create({
                bookingId: booking_id,
                amount: amountToPay,
                status: 1, // initiated
                merchantTransactionId: order.id,
                merchantUserId: `RROOMS_${bookingHotel.userId}`,
                request: options,
                response: order
            });
            // Create redirect URL with payment details
            // const redirectUrl = `http://localhost:3000/razorpay-checkout?order_id=${order.id}&booking_id=${booking_id}&amount=${amountToPay}&key=${keyID}`;
            const redirectUrl = `https://www.rrooms.in/booking-confirm/${booking_id}?order_id=${order.id}&booking_id=${booking_id}&amount=${amountToPay}&key=${keyID}`
            return res.status(200).json({
                status: true,
                data: {
                    order_id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    key: keyID,
                    description: "RRooms Hotel Booking Payment",
                    image: "https://rrooms.in/logo.webp",
                    redirect_url: redirectUrl,
                    callback_url: `https://www.rrooms.in/rrooms/api/rrooms-property/razorpay-status-update?paymentType=${paymentType}&paidAmount=${amountToPay}&dueAmount=${dueAmount}&booking_id=${booking_id}&userId=${bookingHotel.userId}`
                },
                message: "Payment initiated successfully"
            });
        } catch (error) {
            return res.status(500).json({ status: false, data: error, message: error.message });
        }
    },

    async razorpayStatusUpdate(req, res, next) {
        try {
            const { paidAmount, paymentType, dueAmount, userId, booking_id } = req.query;
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
            console.log("razorpayStatusUpdate - ", { paidAmount, paymentType, dueAmount, userId, booking_id, razorpay_payment_id, razorpay_order_id, razorpay_signature });

            if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
                return res.status(400).json({ status: false, message: "Missing payment details" }); // ✅ Validate required fields
            }
            // Verify the signature
            const generatedSignature = crypto
                .createHmac('sha256', keySECRET)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest('hex');
            if (generatedSignature !== razorpay_signature) {
                return res.status(400).json({ status: false, message: "Invalid signature" });
            }

            const payment = await razorpay.payments.fetch(razorpay_payment_id);
            console.log("Payment details from Razorpay:", payment);

            const transaction = await db.Transaction.findOne({
                where: { merchantTransactionId: razorpay_order_id }
            });
            if (!transaction) {
                console.error('Transaction not found for order:', razorpay_order_id);
                return res.status(404).json({ status: false, message: "Transaction not found" });
            }
            await transaction.update({
                status: payment.status === 'captured' ? 2 : 1, // 2 for success, 1 for pending
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                response: payment
            });
            // Map Razorpay payment method to your enum
            let paymentModeEnum = 1; // Default to UPI
            switch (payment.method) {
                case 'upi':
                    paymentModeEnum = 1;
                    break;
                case 'cash':
                    paymentModeEnum = 2;
                    break;
                case 'card':
                    paymentModeEnum = 3;
                    break;
                case 'foc':
                    paymentModeEnum = 4;
                    break;
                case 'prepaid':
                    paymentModeEnum = 5;
                    break;
                case 'paylater':
                    paymentModeEnum = 6;
                    break;
                case 'netbanking':
                    paymentModeEnum = 1; // You can adjust if you want a different value
                    break;
                case 'wallet':
                    paymentModeEnum = 1; // Adjust if needed
                    break;
                default:
                    paymentModeEnum = 1;
                    break;
            }
            if (payment.status === 'captured' && booking_id) {
                const result = await db.BookingHotel.findOne({ where: { id: booking_id } });
                if (result) {
                    let amountToPay = 0;
                    if (paymentType == "Full") {
                        if (result?.collectedPayment == null) {
                            console.log("dueAmount - - ", result?.dueAmount);
                            amountToPay = result?.dueAmount;
                        } else {
                            console.log("dueAmount + paidAmount - ", result?.collectedPayment, paidAmount);
                            amountToPay = parseInt(result?.collectedPayment) + parseInt(paidAmount);
                        }
                    } else {
                        amountToPay = paidAmount;
                    }
                    console.log("colloetdPayement -", {
                        bookingStatus: 1,
                        paymentMode: paymentModeEnum,
                        PaymentStatus: paymentType == 'Full' ? 1 : 0,
                        collectedPayment: amountToPay,
                        dueAmount: dueAmount
                    });

                    await result.update({
                        bookingStatus: 1,
                        paymentMode: paymentModeEnum,
                        PaymentStatus: paymentType == 'Full' ? 1 : 0,
                        collectedPayment: amountToPay,
                        dueAmount: dueAmount
                    });
                    const propertyDetails = await db.PropertyMaster.findOne({
                        where: { id: result.get('propertyId') }
                    }).catch(err => {
                        console.error('Property fetch error', err.message);
                        return null;
                    });
                    const user = await db.User.findOne({
                        where: { id: result.get('userId') }
                    }).catch(err => {
                        console.error('User fetch error', err.message);
                        return null;
                    });
                    if (user) {
                        // bookingConfirmed(
                        //     user.mobile,
                        //     propertyDetails?.propertyMobileNumber || '',
                        //     result.get('bookingCode'),
                        //     propertyDetails?.name || "RRooms Hotel"
                        // );
                        const mailDetails = {
                            userEmail: user.email,
                            userName: user.name,
                            bookingId: result.get('bookingCode'),
                            hotelName: propertyDetails?.name || '',
                            propertyUserEmail: propertyDetails?.propertyEmailId || '',
                            propertyUserName: propertyDetails?.propertyEmailId || ''
                        };
                        console.log('Sending confirmation email:', mailDetails);
                        // sendMail(mailDetails);
                    }
                    // Create payment record
                    await db.Payment.create({
                        bookedId: booking_id,
                        paymentAmount: paidAmount,
                        paymentMode: paymentModeEnum,
                        propertyId: result.propertyId,
                        paymentDate: new Date()
                    });
                }
            } else {
                const user = await db.User.findOne({ where: { id: userId } });
                const booking = await db.BookingHotel.findOne({ where: { id: booking_id } });
                if (user && booking && booking.useWalletAmount > 0) {
                    const wallet = await db.UserWallet.findOne({
                        where: { userId: user.id },
                        order: [
                            ['id', 'DESC'],
                            ['updatedAt', 'DESC']
                        ]
                    });
                    if (wallet) {
                        await db.UserWallet.create({
                            userId: user.id,
                            amount: booking.useWalletAmount,
                            balance: wallet.balance < booking.useWalletAmount ? 0 : wallet.balance - booking.useWalletAmount,
                            transactionType: false
                        });
                    }
                }
            }
            return res.status(200).json({
                status: true,
                data: {
                    paymentStatus: payment.status,
                    paymentDetails: payment
                },
                message: "Payment updated successfully"
            });
        } catch (error) {
            console.error('Razorpay Status Update API Error:', error.message);
            return res.status(500).json({
                status: false,
                data: null,
                message: "Something went wrong"
            });
        }
    },

    async checkRazorpayStatus(req, res, next) {
        try {
            const { booking_id } = req.query;
            if (!booking_id) {
                return res.status(400).json({ status: false, message: "Missing booking_id" });
            }
            const transaction = await db.Transaction.findOne({
                order: [['id', 'DESC']],
                where: { bookingId: booking_id, deletedAt: null }
            });
            if (!transaction) {
                paymentService.validationResponse("Transaction not found for this booking_id");
            }
            let paymentStatus;
            if (transaction.paymentId) {
                paymentStatus = await razorpay.payments.fetch(transaction.paymentId);
            } else {
                paymentStatus = await razorpay.orders.fetch(transaction.merchantTransactionId);
            }
            await transaction.update({
                response: paymentStatus
            });
            if (paymentStatus.status === 'captured') {
                const booking = await db.BookingHotel.findOne({
                    where: { id: booking_id }
                });
                if (booking && booking.bookingStatus !== 1) {
                    await booking.update({
                        bookingStatus: 1,
                        paymentMode: 1,
                        collectedPayment: transaction.amount,
                        dueAmount: booking.dueAmount - transaction.amount
                    });
                }
            }
            return res.status(200).json({
                status: true,
                data: {
                    status: paymentStatus.status,
                    amount: paymentStatus.amount / 100,
                    transaction: transaction,
                    paymentDetails: paymentStatus
                },
                message: "Payment status checked successfully"
            });
        } catch (error) {
            console.error('Check Razorpay Status Error:', error.message);
            if (error.message.includes('Not Found')) {
                return res.status(404).json({
                    status: false,
                    message: "Transaction not found on Razorpay"
                });
            }
            return res.status(500).json({
                status: false,
                data: error,
                message: error.message ? error.message : "Something went wrong"
            });
        }
    },

    async razorpayInitInvoicePayment(req, res, next) {
        try {
            const { invoice_id } = req.query;
            const propertyInvoice = await db.PropertyInvoice.findOne({
                where: { invoice_id: invoice_id, deletedAt: null }
            });
            if (!propertyInvoice) {
                paymentService.validationResponse("Invalid invoice_id");
            }
            const options = {
                amount: propertyInvoice.totalPayableAmount * 100, // amount in paise
                currency: "INR",
                receipt: `RROOMS_INV_${Date.now()}`,
                notes: {
                    invoice_id: invoice_id,
                    propertyId: propertyInvoice.propertyId
                }
            };
            const order = await razorpay.orders.create(options);
            // Save invoice transaction details
            const proInvoiceTransaction = await db.PropertyInvoiceTransaction.create({
                invoice_id: invoice_id,
                amount: propertyInvoice.totalPayableAmount,
                status: 1, // initiated
                merchantTransactionId: order.id,
                merchantUserId: `RROOMS_PI_${propertyInvoice.propertyId}`,
                request: options,
                response: order
            });
            return res.status(200).json({
                status: true,
                data: {
                    order_id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    key: keyID
                },
                message: "Invoice payment initiated successfully"
            });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    async razorpayVerifyInvoicePayment(req, res, next) {
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
            // Verify the payment signature
            const generatedSignature = crypto
                .createHmac('sha256', keySECRET)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest('hex');
            if (generatedSignature !== razorpay_signature) {
                return res.status(400).json({ status: false, message: "Invalid signature" });
            }
            // Get order details
            const order = await razorpay.orders.fetch(razorpay_order_id);
            const { invoice_id } = order.notes;
            // Update invoice status
            await db.PropertyInvoiceTransaction.update({
                status: 2, // completed
                paymentId: razorpay_payment_id,
                signature: razorpay_signature
            }, {
                where: { merchantTransactionId: razorpay_order_id }
            });
            // Update invoice payment status
            await db.PropertyInvoice.update({
                merchantTransactionId: razorpay_order_id,
                paymentMode: 1,
                paymentSource: 'ONLINE',
                paymentStatus: 'paid',
                collectedPayment: order.amount / 100,
                paymentDate: new Date()
            }, {
                where: { invoice_id: invoice_id }
            });
            return res.status(200).json({
                status: true,
                message: "Invoice payment verified successfully"
            });
        } catch (error) {
            console.error('Invoice payment verification error:', error);
            return res.status(500).json({ status: false, message: "Invoice payment verification failed" });
        }
    },

    async razorpayCheckStatusForInvoicePayment(req, res, next) {
        try {
            const { invoice_id } = req.query;
            const transaction = await db.PropertyInvoiceTransaction.findOne({
                order: [['id', 'DESC']],
                where: { invoice_id: invoice_id, deletedAt: null },
                include: [{ model: db.PropertyInvoice, required: true }]
            });
            if (!transaction) {
                paymentService.validationResponse("Transaction not found for this invoice_id");
            }
            try {
                const order = await razorpay.orders.fetch(transaction.merchantTransactionId);
                const data = {
                    ...order,
                    invoice_detail: transaction.PropertyInvoice
                };
                return res.status(200).json({
                    status: true,
                    data: data,
                    message: "Invoice payment status fetched successfully"
                });
            } catch (error) {
                return res.status(400).json({
                    status: false,
                    message: "Payment not found on Razorpay"
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message || "Something went wrong"
            });
        }
    }
};