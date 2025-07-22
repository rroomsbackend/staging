import * as banquetBookingPaymentService from './banquetBookingPaymentService';
import { getPagination, getPagingData } from '../../pagination/index';

// Create a new BanquetBookingPayment
export const createBanquetBookingPayment = async (req, res) => {
    try {
        const banquetBookingPayment = await banquetBookingPaymentService.createBanquetBookingPayment(req.body);
        return res.status(201).json({ success: true, message: 'created sucessfully', data: banquetBookingPayment });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get all BanquetBookingPayments
export const getAllBanquetBookingPayments = async (req, res) => {
    try {
        const { propertyId, banquetBookingId, page, size } = req?.query;
        const { limit, offset } = getPagination(page, size);

        const banquetBookingPayments = await banquetBookingPaymentService.getAllBanquetBookingPayments(propertyId, banquetBookingId, limit, offset);

        return res.status(200).json({ success: true, message: 'list of payents', ...getPagingData(banquetBookingPayments, page, limit) });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get a single BanquetBookingPayment by ID
export const getBanquetBookingPaymentById = async (req, res) => {
    try {
        const banquetBookingPayment = await banquetBookingPaymentService.getBanquetBookingPaymentById(req.params.id);
        return res.status(200).json({ success: true, message: 'payment details', data: banquetBookingPayment });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Update a BanquetBookingPayment
export const updateBanquetBookingPayment = async (req, res) => {
    try {
        const updatedBanquetBookingPayment = await banquetBookingPaymentService.updateBanquetBookingPayment(req.params.id, req.body);
        return res.status(200).json({ success: true, message: 'updated successfully', data: updatedBanquetBookingPayment });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Delete a BanquetBookingPayment
export const deleteBanquetBookingPayment = async (req, res) => {
    try {
        await banquetBookingPaymentService.deleteBanquetBookingPayment(req.params.id);
        return res.status(200).send({ success: true, message: 'deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const banquetBookingPaymentReport = async (req, res) => {
    try {

        const workbook = await banquetBookingPaymentService.downloadBanquetBookingPaymentReport(req.query);
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=banquet_booking_payment_report.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}