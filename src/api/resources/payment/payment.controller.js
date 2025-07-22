import { db } from '../../../models';
import { bookingConfirmed } from '../sendOtp/sendOtpApis';
import paymentService from './payment.service';

export default {
    async initPayment(req, res, next) {
        try {
            const { booking_id, paymentType } = req.query;
            console.log("paymentType - ", paymentType);
            const bookingHotel = await db.BookingHotel.findOne({ where: { id: booking_id, deletedAt: null } })
            if (!bookingHotel) {
                paymentService.validationResponse("Invalid booking_id");
            }
            let amountToPay = bookingHotel.dueAmount;

            if (paymentType == "Partial") { amountToPay = (bookingHotel.bookingAmout * 0.25); }
			console.log("amountToPay  -", amountToPay );
            const dueAmount = bookingHotel.dueAmount - amountToPay;
            const payload = {
                merchantId: process.env.PHONEPE_MERCHANT_ID,
                merchantTransactionId: "RROOMS_" + Date.now(),
                merchantUserId: "RROOMS_" + bookingHotel.userId,
                // amount: bookingHotel.dueAmount * 100,
                amount: Math.round(amountToPay * 100),
                redirectUrl: `https://www.rrooms.in/booking-confirm/${booking_id}`,
                redirectMode: "REDIRECT",
                callbackUrl: `https://rrooms.in/rrooms/api/rrooms-property/status-update?paymentType=${paymentType}&paidAmount=${amountToPay}&dueAmount=${dueAmount}&booking_id=${booking_id}&userId=${bookingHotel.userId}`,
                paymentInstrument: {
                    type: "PAY_PAGE"
                }
            }
            // console.log(`https://rrooms.in/rrooms/api/rrooms-property/status-update?paymentType=${paymentType}&paidAmount=${amountToPay}&dueAmount=${dueAmount}`);

            const response = await paymentService.initiate(payload, booking_id);
            // console.log('-------response--------', response)
            if (response.success) {
                return res.status(200).json({ status: true, data: response, message: "Payment initiated successfully" });
            }
            return res.status(400).json({ status: true, data: response, message: "Payment not initiated" });
        } catch (error) {
            return res.status(500).json({ status: true, data: error, message: error.message });
        }
    },

    // async statusUpdate(req, res, next) {
    //     try {
    //         const data = JSON.parse(Buffer.from(req.body.response, "base64").toString('utf8'));
    //         console.log("data - ", data);  
    //         const response = await paymentService.update(data).catch(error => { console.log('paymentService update error', error.message) });
    //         /*if(data?.code == "PAYMENT_SUCCESS" && data?.bookingId){
    //             console.log('----------', data);
    //             db.BookingHotel.findOne({ where: {id:data?.bookingId }}).then(async (result)=> {
    //                 console.log('nnnnnnn', result);
    //                 if(result){
    //                     result.update({bookingStatus: 1, paymentMode: 1});
    //                     const propertyDetails = await db.PropertyMaster.findOne({where: { id: result.get('propertyId')}}).catch(err=>{});
    //                     await db.User.findOne({where: { id: result.get('userId') }}).then(user=>{
    //                         console.log('------user', user);
    //                         bookingConfirmed(user.mobile, propertyDetails.propertyMobileNumber, result.get('bookingCode'), propertyDetails ? propertyDetails?.name : "Rrooms Hotel");
    //                         const mailDetails = {
    //                             userEmail: user.email,
    //                             userName: user.name,
    //                             bookingId: result.get('bookingCode'),
    //                             hotelName: propertyDetails.name,
    //                             propertyUserEmail: propertyDetails.propertyEmailId,
    //                             propertyUserName: propertyDetails.propertyEmailId
    //                         }
    //                         console.log('send mail------', mailDetails);                   
    //                         sendMail(mailDetails);
    //                     }).catch(error=>{});                        
    //                 }
    //             })
    //         }*/
    //         if (response) {
    //             return res.status(200).json({ status: true, data: response, message: "Payment updated successfully" });
    //         }
    //         return res.status(500).json({ status: true, data: null, message: "Something went wrong" });
    //     } catch (error) {
    //         return res.status(500).json({ status: true, data: error, message: "Something went wrong" });
    //     }
    // },

    async statusUpdate(req, res, next) {
        try {
            const { paidAmount, paymentType, dueAmount, userId, booking_id } = req.query;
            console.log("statusUpdate -amount, paymentType, dueAmount----- ", paidAmount, paymentType, dueAmount);
            const data = JSON.parse(Buffer.from(req.body.response, "base64").toString('utf8'));           
            console.log("Decoded payment data - ", data);
            const response = await paymentService.update(data).catch(error => {
                console.error('paymentService update error', error.message);
                throw error;
            });
console.log("response - statusUpdate - ", response );
console.log("data?.code === PAYMENT_SUCCESS && data?.bookingId -", data?.code === "PAYMENT_SUCCESS" && data?.bookingId)
            if (data?.code === "PAYMENT_SUCCESS" && data?.bookingId) {
                console.log('Payment Success Data:', data);
                const result = await db.BookingHotel.findOne({ where: { id: data.bookingId } });
                if (result) {
                    await result.update({ bookingStatus: 1, paymentMode: 1, collectedPayment : paidAmount, dueAmount:dueAmount }); // << added await
                    const propertyDetails = await db.PropertyMaster.findOne({ where: { id: result.get('propertyId') } }).catch(err => {
                        console.error('Property fetch error', err.message);
                        return null;
                    });
                    const user = await db.User.findOne({ where: { id: result.get('userId') } }).catch(err => {
                        console.error('User fetch error', err.message);
                        return null;
                    });
                    if (user) {
                        console.log('User Details:', user.dataValues);
                        bookingConfirmed(
                            user.mobile,
                            propertyDetails?.propertyMobileNumber || '',
                            result.get('bookingCode'),
                            propertyDetails?.name || "RRooms Hotel"
                        );
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
                }
            }else{
                const res = await db.User.findOne({ where: { id: userId } })
                const result = await db.BookingHotel.findOne({ where: { id: booking_id } })
                if (res && result.useWalletAmount > 0) {
                    const wallet = await db.UserWallet.findOne({
                        where: { userId: res.id },
                        order: [
                            ['id', 'DESC'],
                            ['updatedAt', 'DESC']
                        ]
                    });
                    if (wallet) {
                        await db.UserWallet.create({
                            userId: res.id,
                            amount: result.useWalletAmount,
                            balance: wallet.balance < result.useWalletAmount ? 0 : wallet.balance - result.useWalletAmount,
                            transactionType: false
                        });
                    }
                }
            }
            return res.status(200).json({ status: true, data: response, message: "Payment updated successfully" });
        } catch (error) {
            console.error('Status Update API Error:', error.message);
            return res.status(500).json({ status: false, data: null, message: "Something went wrong" });
        }
    },

    async checkStatus(req, res, next) {
        try {
            const { booking_id } = req.query;
            const transaction = await db.Transaction.findOne({ order: [['id', 'DESC']], where: { bookingId: booking_id, deletedAt: null } })
            if (!transaction) {
                paymentService.validationResponse("Transaction not found for this booking_id");
            }
            const paymentStatus = await paymentService.getTransactionStatus(transaction.merchantTransactionId);
            if (paymentStatus?.code == 'TRANSACTION_NOT_FOUND') {
                paymentService.validationResponse("Transaction not found for this booking_id");
            }
            const response = await paymentService.update(paymentStatus);
            if (response) {
                return res.status(200).json({ status: true, data: response, message: "Payment updated successfully" });
            }
            return res.status(500).json({ status: false, data: null, message: "Something went wrong" });
        } catch (error) {
            return res.status(500).json({ status: false, data: error, message: error.message ? error.message : "Something went wrong" });
        }
    },

    async initInvoicePayment(req, res, next) {
        try {
            const { invoice_id } = req.query;
            const propertyInvoice = await db.PropertyInvoice.findOne({ where: { invoice_id: invoice_id, deletedAt: null } })
            if (!propertyInvoice) {
                paymentService.validationResponse("Invalid invoice_id");
            }
            const payload = {
                merchantId: process.env.PHONEPE_MERCHANT_ID,
                merchantTransactionId: "RROOMS_" + Date.now(),
                merchantUserId: "RROOMS_PI_" + propertyInvoice.propertyId,
                amount: propertyInvoice.totalPayableAmount * 100,
                redirectUrl: `https://www.rrooms.in/invoice-payment-confirm/${invoice_id}`,
                redirectMode: "REDIRECT",
                callbackUrl: "https://staging-api.rrooms.in/api/rrooms-property/invoice-payment-status-update",
                paymentInstrument: {
                    type: "PAY_PAGE"
                }
            }
            const response = await paymentService.initiateInvoicePayment(payload, invoice_id);
            console.log('---------------', response)
            if (response.success) {
                return res.status(200).json({ status: true, data: response, message: "Invoice payment initiated successfully" });
            }
            return res.status(400).json({ status: true, data: response, message: "Invoice payment not initiated" });
        } catch (error) {
            return res.status(500).json({ status: true, data: error, message: error.message });
        }
    },

    async statusUpdateForInvoicePayment(req, res, next) {
        try {
            const data = JSON.parse(Buffer.from(req.body.response, "base64").toString('utf8'));
            const response = await paymentService.updateInvoicePayment(data).catch(error => { console.log('invoice paymentService update error', error.message) });
            if (response) {
                return res.status(200).json({ status: true, data: response, message: "Invoice payment updated successfully" });
            }
            return res.status(500).json({ status: true, data: null, message: "Something went wrong" });
        } catch (error) {
            return res.status(500).json({ status: true, data: error, message: "Something went wrong" });
        }
    },

    async checkStatusForInvoicePayment(req, res, next) {
        try {
            const { invoice_id } = req.query;
            const transaction = await db.PropertyInvoiceTransaction.findOne({
                order: [['id', 'DESC']], where: { invoice_id: invoice_id, deletedAt: null },
                include: [
                    {
                        model: db.PropertyInvoice,
                        required: true
                    }
                ]
            })

            if (!transaction) {
                paymentService.validationResponse("Transaction not found for this invoice_id");
            }
            const paymentStatus = await paymentService.getTransactionStatus(transaction.merchantTransactionId);
            if (paymentStatus?.code == 'TRANSACTION_NOT_FOUND') {
                paymentService.validationResponse("Transaction not found for this invoice_id");
            }
            const response = await paymentService.updateInvoicePayment(paymentStatus);
            if (response) {
                const data = { ...response, 'invoice_detail': transaction['PropertyInvoice'] };
                return res.status(200).json({ status: true, data: data, message: "Invoice payment updated successfully" });
            }
            return res.status(500).json({ status: false, data: null, message: "Something went wrong" });
        } catch (error) {
            return res.status(500).json({ status: false, data: error, message: error.message ? error.message : "Something went wrong" });
        }
    },
};
