import { db } from '../../../models';
import axios from 'axios';
import { createHash } from "crypto";
import { bookingConfirmed } from '../sendOtp/sendOtpApis';
import { sendMail } from '../zoptomail/zeptomail';

const sha256 = (content) => {
    return createHash('sha256').update(content).digest('hex');
}

const initiate = async (payload, booking_id) => {
    try {
        const request = Buffer.from(JSON.stringify(payload)).toString('base64');
        const checksum = sha256(request + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY);
        const headers = {
            "Content-Type": "application/json",
            "X-VERIFY": checksum + "###" + process.env.PHONEPE_SALT_INDEX
        }
        const body = {
            request: request
        }
        const response = await axios.post(
            process.env.PHONEPE_BASE_URL + "/pg/v1/pay",
            body,
            {
                headers: headers
            }
        );
        
        //console.log('Payment Response',response);
        //return response.data;
        const transaction = await db.Transaction.create({
            bookingId: booking_id,
            amount: payload.amount / 100,
            status: 1, //response.data.code,
            merchantTransactionId: payload.merchantTransactionId,
            merchantUserId: payload.merchantUserId,
            request: payload,
            response: response.data
        }).catch(error=>{
            console.log('db.Transaction.create error', error.message)
        });
        const transactionLog = await db.TransactionLog.create({
            transactionId: transaction.id,
            status: 1, //response.data.code,
            request: payload,
            response: response.data
        }).catch(error=>{
            console.log('db.TransactionLog.create error', error.message)
        })
        //console.log('===============', response.data)
        return response.data;
    } catch (error) {
	console.log('main ---', error.message);
        if (error.response) {
            return error.response.data;
        }
        return false;
    }
}

const initiateInvoicePayment = async (payload, invoice_id) => {
    try {
        const request = Buffer.from(JSON.stringify(payload)).toString('base64');
        const checksum = sha256(request + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY);
        const headers = {
            "Content-Type": "application/json",
            "X-VERIFY": checksum + "###" + process.env.PHONEPE_SALT_INDEX
        }
        const body = {
            request: request
        }
        const response = await axios.post(
            process.env.PHONEPE_BASE_URL + "/pg/v1/pay",
            body,
            {
                headers: headers
            }
        );
        
        const proInvoiceTransaction = await db.PropertyInvoiceTransaction.create({
            invoice_id: invoice_id,
            amount: payload.amount / 100,
            status: 1, //response.data.code,
            merchantTransactionId: payload.merchantTransactionId,
            merchantUserId: payload.merchantUserId,
            request: payload,
            response: response.data
        }).catch(error=>{
            console.log('db.PropertyInvoiceTransaction.create error', error.message)
        });
        const transactionLog = await db.TransactionLog.create({
            invoiceTransactionId: proInvoiceTransaction.id,
            status: 1, //response.data.code,
            request: payload,
            response: response.data
        }).catch(error=>{
            console.log('db.TransactionLog.create error', error.message)
        })
        //console.log('===============', response.data)
        return response.data;
    } catch (error) {
	console.log('main ---', error.message);
        if (error.response) {
            return error.response.data;
        }
        return false;
    }
}

const getTransactionStatus = async (merchantTransactionId) => {
    try {
        const checksum = sha256(`/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`+process.env.PHONEPE_SALT_KEY);
        const headers = {
            "Content-Type": "application/json",
            "X-VERIFY": checksum + "###" + process.env.PHONEPE_SALT_INDEX,
            "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID
        }
        const response = await axios.get(
            process.env.PHONEPE_BASE_URL + `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
            {headers: headers}
        );
        return response.data;
    } catch (error) {

        if (error.response) {
            return error.response.data;
        }
        return false;
    }
}

const update = async (data) => {
    let response = {
        status: "failed"
    }
    try {
        let status = false;
        if (data.code) {
            switch (data.code) {
                case "PAYMENT_SUCCESS":
                    status = await updateBookingStatus(data, true);
                    response.status = "success";
                    break;
                case "PAYMENT_ERROR":
                    status = await updateBookingStatus(data, false);
                    response.status = "failed";
                    break;
                case "PAYMENT_PENDING":
                    status = await updateBookingPendingStatus(data);
                    response.status = "pending";
                    break;
                default:
                    status = await logTransaction(data);
                    response = false;
                    break;
            }
        }
        return response;
    } catch (error) {
        return false;
    }
}

const updateInvoicePayment = async (data) => {
    let response = {
        status: "failed"
    }
    try {
        let status = false;
        if (data.code) {
            switch (data.code) {
                case "PAYMENT_SUCCESS":
                    status = await updateInvoicePaymentStatus(data, 'paid');
                    response.status = "success";
                    break;
                case "PAYMENT_ERROR":
                    status = await updateInvoicePaymentStatus(data, 'failed');
                    response.status = "failed";
                    break;
                case "PAYMENT_PENDING":
                    status = await updateInvoicePaymentStatus(data, 'pending');
                    response.status = "pending";
                    break;
                default:
                    status = await logInvoiceTransaction(data);
                    response = false;
                    break;
            }
        }
        return response;
    } catch (error) {
        return false;
    }
}

const logTransaction = async (
    data
) => {
    try {
        const transaction = await db.Transaction.find({
            where: { merchantTransactionId: data.data.merchantTransactionId },
            include: [
                {
                    model: db.BookingHotel,
                    required: true
                }
            ]
        });
        if (transaction) {
            await db.TransactionLog.create({
                transactionId: transaction.id,
                status: 1,//data.code,
                request: { paymentStatusCheck: true},
                response: data
            });
        }
        return false;
    } catch (error) {
        return false;
    }
}

const logInvoiceTransaction = async (
    data
) => {
    try {
        const transaction = await db.PropertyInvoiceTransaction.find({
            where: { merchantTransactionId: data.data.merchantTransactionId },
            include: [
                {
                    model: db.PropertyInvoice,
                    required: true
                }
            ]
        });
        if (transaction) {
            await db.TransactionLog.create({
                invoiceTransactionId: transaction.id,
                status: 1,//data.code,
                request: { paymentStatusCheck: true},
                response: data
            });
        }
        return false;
    } catch (error) {
        return false;
    }
}

const updateBookingPendingStatus = async (
    data
) => {
    try {
        const transaction = await db.Transaction.find({
            where: { merchantTransactionId: data.data.merchantTransactionId },
            include: [
                {
                    model: db.BookingHotel,
                    required: true
                }
            ]
        });
        if (transaction) {
            await db.TransactionLog.create({
                transactionId: transaction.id,
                status: 1,//data.code,
                request: { paymentStatusCheck: true},
                response: data
            });
            transaction.update({
                status: 1,//data.code,
                response: data
            });
            transaction.BookingHotel.update({
                bookingStatus: 8,
                paymentMode: 1,
                PaymentStatus: 8,
            });
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

const updateBookingStatus = async (
    data,
    paymentStatus
) => {
    try {
        const transaction = await db.Transaction.find({
            where: { merchantTransactionId: data.data.merchantTransactionId },
            include: [
                {
                    model: db.BookingHotel,
                    required: true
                }
            ]
        });
        if (transaction) {
            const paidAmountInRupee = data.data.amount / 100;
            await db.TransactionLog.create({
                transactionId: transaction.id,
                status: 1,//data.code,
                request: { paymentStatusCheck: true},
                response: data
            });
            transaction.update({
                status: 1,//data.code,
                response: data
            });
            transaction.BookingHotel.update({
                bookingStatus: 1, //paymentStatus ? 1 : 7, // 1 success | 7 fail
                paymentMode: paymentStatus ? 1 : 0, // 1 online , as discussed with umesh in failed case update o
                PaymentStatus: paymentStatus ? 1 : 0, // 1 success | 7 fail, as discussed with umesh in failed case update o
                collectedPayment: paymentStatus ? paidAmountInRupee : transaction.BookingHotel.collectedPayment,
                dueAmount: (transaction.BookingHotel.dueAmount >= paidAmountInRupee && paymentStatus) ? transaction.BookingHotel.dueAmount - paidAmountInRupee : transaction.BookingHotel.dueAmount
            });

            db.BookingHotel.findOne({ where: {id: transaction.bookingId }}).then(async (result)=> {
                if(result){
                    //result.update({bookingStatus: 1, paymentMode: 1});
                    const propertyDetails = await db.PropertyMaster.findOne({where: { id: result.get('propertyId')}}).catch(err=>{});
                    await db.User.findOne({where: { id: result.get('userId') }}).then(user=>{
                        console.log('------user', user);
                        bookingConfirmed(user.mobile, propertyDetails.propertyMobileNumber, result.get('bookingCode'), propertyDetails ? propertyDetails?.name : "Rrooms Hotel");
                        const mailDetails = {
                            userEmail: user.email,
                            userName: user.name,
                            bookingId: result.get('bookingCode'),
                            hotelName: propertyDetails.name,
                            propertyUserEmail: propertyDetails.propertyEmailId,
                            propertyUserName: propertyDetails.propertyEmailId
                        }
                        //console.log('send mail------', mailDetails);                   
                        sendMail(mailDetails);
                    }).catch(error=>{});                        
                }
            })

            if (paymentStatus) {
                await db.Payment.create({
                    bookedId: transaction.bookingId,
                    paymentAmount: paidAmountInRupee,
                    paymentMode: 1,
                    propertyId: transaction.BookingHotel.propertyId,
                    paymentDate: transaction.createdAt
                });
            }
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

const updateInvoicePaymentStatus = async (
    data,
    paymentStatus
) => {
    try {
        const transaction = await db.PropertyInvoiceTransaction.find({
            where: { merchantTransactionId: data.data.merchantTransactionId },
            include: [
                {
                    model: db.PropertyInvoice,
                    required: true
                }
            ]
        });
        if (transaction) {
            const paidAmountInRupee = data.data.amount / 100;
            await db.TransactionLog.create({
                invoiceTransactionId: transaction.id,
                status: 1,//data.code,
                request: { paymentStatusCheck: true},
                response: data
            });
            transaction.update({
                status: 1,//data.code,
                response: data
            });
            transaction.PropertyInvoice.update({
                merchantTransactionId:transaction.merchantTransactionId,
                paymentMode: 1, // 1 online, 0 offline
                paymentSource:'ONLINE',
                paymentStatus: paymentStatus,
                collectedPayment: paymentStatus == 'paid' ? paidAmountInRupee : 0,
                paymentDate: transaction.createdAt
            });

            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { initiate, update, getTransactionStatus, validationResponse, initiateInvoicePayment, updateInvoicePayment }
