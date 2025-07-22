import { db } from '../../../../models/index';
import * as ExcelJS from 'exceljs';
import { Op } from 'sequelize';
import { createExcelSheet } from '../../../../utils/createExcelSheet'
const { BanquetBookingPayment, BanquetBooking } = db;
// Create a new BanquetBookingPayment
export const createBanquetBookingPayment = async (banquetBookingPaymentData) => {
    try {
        const banquetBooking = BanquetBooking.findByPk(banquetBookingPaymentData?.banquetBookingId);
        const newPaidAmount = (isNaN(banquetBooking.paidAmount) ? 0 : banquetBooking.paidAmount) + banquetBookingPaymentData?.paidAmount;
        const newDueAmount = isNaN(banquetBooking?.dueAmount) ? 0 : banquetBooking?.dueAmount - banquetBookingPaymentData?.paidAmount;
        let paymentstatus = 0;
        if (banquetBookingPaymentData?.paidAmount >= banquetBooking?.dueAmount) {
            paymentstatus = 1;
        }
        const banquetBookingUpdate = await BanquetBooking.update(
            {
                paidAmount: newPaidAmount,
                dueAmount: newDueAmount,
                paymentStatus: paymentstatus,

            }, {
            where: {
                banquetBookingId: banquetBookingPaymentData.banquetBookingId
            }
        })
        if (!banquetBookingUpdate[0]) {
            throw new Error('Amount could not be upated')
        }

        const banquetBookingPayment = await BanquetBookingPayment.create(banquetBookingPaymentData);
        return banquetBookingPayment;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Get all BanquetBookingPayments
export const getAllBanquetBookingPayments = async (propertyId, banquetBookingId, limit, offset) => {
    try {
        let whereClause = {};
        if (propertyId) {
            whereClause.propertyId = propertyId;
        }
        if (banquetBookingId) {
            whereClause.banquetBookingId = banquetBookingId;
        }
        const banquetBookingPayments = await BanquetBookingPayment.findAndCountAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC'],
            ],
            limit,
            offset,
        });
        return banquetBookingPayments;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};


// Get a single BanquetBookingPayment by ID
export const getBanquetBookingPaymentById = async (id) => {
    try {
        const banquetBookingPayment = await BanquetBookingPayment.findByPk(id);
        if (!banquetBookingPayment) {
            throw new Error('BanquetBookingPayment not found');
        }
        return banquetBookingPayment;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Update a BanquetBookingPayment
export const updateBanquetBookingPayment = async (id, banquetBookingPaymentData) => {
    try {
        const [updated] = await BanquetBookingPayment.update(banquetBookingPaymentData, {
            where: { banquatBookingPaymentID: id }
        });
        if (!updated) {
            throw new Error('BanquetBookingPayment not found');
        }
        const updatedBanquetBookingPayment = await BanquetBookingPayment.findByPk(id);
        return updatedBanquetBookingPayment;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Delete a BanquetBookingPayment
export const deleteBanquetBookingPayment = async (id) => {
    try {
        const deleted = await BanquetBookingPayment.destroy({
            where: { banquatBookingPaymentID: id }
        });
        if (!deleted) {
            throw new Error('BanquetBookingPayment not found');
        }
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const downloadBanquetBookingPaymentReport = async (query) => {
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
        let banquetBookings = await BanquetBookingPayment.findAll({
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

