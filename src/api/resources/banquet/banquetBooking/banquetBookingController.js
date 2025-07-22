import * as banquetBookingService from './banquetBookingService';
import { getPagination, getPagingData } from '../../pagination/index';
import * as aws from 'aws-sdk';
import { config } from 'dotenv'
config()
// Create a new BanquetBooking
export const createBanquetBooking = async (req, res) => {
    try {
        // const s3 = new aws.S3({
        //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //     region: process.env.AWS_REGION,
        // });
        // const file = req.file;
        // const s3Params = {
        //     Bucket: process.env.AWS_S3_BUCKET_NAME,
        //     Key: `uploads/${new Date()}-${file?.originalname}`,
        //     Body: file?.buffer,
        //     ContentType: file?.mimetype,
        //     ACL: 'public-read', // Optional: Set access control
        // };

        //   let s3UploadResponse;
        // if(file){
        //     s3UploadResponse = await s3.upload(s3Params).promise();
        // }

        // const attachmentUrl = s3UploadResponse?.Location;

        // req.body.attachmentUrl = attachmentUrl;
        // const banquetBooking = await banquetBookingService.createBanquetBooking(req.body);
        let filePath = req.file ? `uploads/banquet-menu/${req.file.filename}` : null; // Store file path
        const bookingData = {
            ...req.body,
            attachmentUrl: filePath, // Add file path to request body
        };
        const banquetBooking = await banquetBookingService.createBanquetBooking(bookingData);


        return res.status(201).json({ success: true, message: 'booking created successfully', data: banquetBooking });
    } catch (error) {
        console.log("catch - ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all BanquetBookings
export const getAllBanquetBookings = async (req, res) => {
    try {
        const { search, propertyId, bookingCode, enquiryCode, mobile, paymentStatus, bookingStatus, reserveBookingDate, page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const banquetBookings = await banquetBookingService.getAllBanquetBookings(search, propertyId, bookingCode, enquiryCode, mobile, paymentStatus, bookingStatus, reserveBookingDate, limit, offset);
        return res.status(200).json({ success: true, message: 'banquet booking list', ...getPagingData(banquetBookings, page, limit) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single BanquetBooking by ID
export const getBanquetBookingById = async (req, res) => {
    try {
        const banquetBooking = await banquetBookingService.getBanquetBookingById(req.params.id);
        return res.status(200).json({ success: true, message: 'booking details', data: banquetBooking, });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update a BanquetBooking
export const updateBanquetBooking = async (req, res) => {
    try {
        const updatedBanquetBooking = await banquetBookingService.updateBanquetBooking(req.params.id, req.body);
        return res.status(200).json({ success: true, message: 'updated sucessfullt', data: updatedBanquetBooking });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a BanquetBooking
export const deleteBanquetBooking = async (req, res) => {
    try {
        await banquetBookingService.deleteBanquetBooking(req.params.id);
        return res.status(200).send({ success: true, message: 'deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const downloadBanquetBookingReport = async (req, res) => {
    try {

        const workbook = await banquetBookingService.downloadBanquetBookingReport(req.query);
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=banquet_booking_report.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}