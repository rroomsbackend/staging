import express from 'express';
import * as BanquetBookingPaymntController from './banquetBookingPayment/banquetBookingPaymentController';
import * as BookedVenueController from './bookedVenue/bookedVenueController';
import * as BookedServiceController from './bookedService/bookedServiceController';
import * as BanquetBookingController from './banquetBooking/banquetBookingController'; // Assuming a controller for banquet booking
import * as BanquetEnquiryController from './banquetEnquiry/banquetEnquiryController'
import * as BanquetEnquiryLogController from './banquetEnquiryLog/banquetEnquiryLogController'
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';
// const multer = require('multer');
// const storage = multer.memoryStorage(); // Use memory storage for handling files before uploading to S3
// const upload = multer({ storage: storage });
import multer from "multer";
import path from "path";
import fs from "fs";
export const banquetRouter = express.Router();

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "../../../uploads/banquet-menu");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = [
    "image/jpeg", "image/png", "image/gif", // Images
    "application/pdf", // PDF
    "application/msword", // DOC
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/vnd.ms-excel", // XLS
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
    "text/csv" // CSV
];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save images in the "uploads/cities" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images, documents, and Excel files are allowed!"), false);
    }
};

// Set limits (e.g., max file size: 2MB)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("file");

// Middleware to handle errors
const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Handle multer-specific errors
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ status: false, message: "File size exceeds 2MB limit!" });
            }
            console.log(" if - ", err);
            return res.status(400).json({ status: false, message: err.message });
        } else if (err) {
            // Handle other errors (e.g., file type)
            console.log("else if - ", err);
            return res.status(400).json({ status: false, message: err.message });
        }
        next();
    });
};

// Banquet booking payment routes
banquetRouter.route('/banquet-booking-payment')
    .get(sanitize(), verifyJWTToken, BanquetBookingPaymntController.getAllBanquetBookingPayments)
    .post(sanitize(), verifyJWTToken, BanquetBookingPaymntController.createBanquetBookingPayment);

banquetRouter.route('/banquet-booking-payment/:id')
    .get(sanitize(), verifyJWTToken, BanquetBookingPaymntController.getBanquetBookingPaymentById) // Get banquet booking payment by ID
    .patch(sanitize(), verifyJWTToken, BanquetBookingPaymntController.updateBanquetBookingPayment)
    .delete(sanitize(), verifyJWTToken, BanquetBookingPaymntController.deleteBanquetBookingPayment);

banquetRouter.route('/banquet-booking-payment-report').get(BanquetBookingPaymntController.banquetBookingPaymentReport)

// Booked venue routes
banquetRouter.route('/booked-venue')
    .get(sanitize(), verifyJWTToken, BookedVenueController.getAllBookedVenues)
    .post(sanitize(), verifyJWTToken, BookedVenueController.createBookedVenue);

banquetRouter.route('/booked-venue/:id')
    .get(sanitize(), verifyJWTToken, BookedVenueController.getBookedVenueById) // Get booked venue by ID
    .patch(sanitize(), verifyJWTToken, BookedVenueController.updateBookedVenue)
    .delete(sanitize(), verifyJWTToken, BookedVenueController.deleteBookedVenue);

// Booked service routes
banquetRouter.route('/booked-service')
    .get(sanitize(), verifyJWTToken, BookedServiceController.getAllBookedServices)
    .post(sanitize(), verifyJWTToken, BookedServiceController.createBookedService);

banquetRouter.route('/booked-service/:id')
    .get(sanitize(), verifyJWTToken, BookedServiceController.getBookedServiceById) // Get booked service by ID
    .patch(sanitize(), verifyJWTToken, BookedServiceController.updateBookedService)
    .delete(sanitize(), verifyJWTToken, BookedServiceController.deleteBookedService);

// Banquet booking routes
banquetRouter.route('/banquet-booking')
    .get(sanitize(), verifyJWTToken, BanquetBookingController.getAllBanquetBookings)
    .post(sanitize(), verifyJWTToken, uploadMiddleware, BanquetBookingController.createBanquetBooking);
    // .post(sanitize(), verifyJWTToken, upload.single('file'), BanquetBookingController.createBanquetBooking);

banquetRouter.route('/banquet-booking/:id')
    .get(sanitize(), verifyJWTToken, BanquetBookingController.getBanquetBookingById) // Get banquet booking by ID
    .patch(sanitize(), verifyJWTToken, BanquetBookingController.updateBanquetBooking)
    .delete(sanitize(), verifyJWTToken, BanquetBookingController.deleteBanquetBooking);

banquetRouter.route('/banquet-booking-report').get(BanquetBookingController.downloadBanquetBookingReport)

// banquet enquiry
banquetRouter.route('/banquet-enquiry')
    .get(sanitize(), verifyJWTToken, BanquetEnquiryController.getAllBanquetEnquiries)
    .post(sanitize(), verifyJWTToken, BanquetEnquiryController.createBanquetEnquiry);

banquetRouter.route('/banquet-enquiry/:id')
    .get(sanitize(), verifyJWTToken, BanquetEnquiryController.getBanquetEnquiryById)
    .put(sanitize(), verifyJWTToken, BanquetEnquiryController.updateBanquetEnquiry)
    .delete(sanitize(), verifyJWTToken, BanquetEnquiryController.deleteBanquetEnquiry);

banquetRouter.route('/banquet-enquiry-report').get(BanquetEnquiryController.downloadBanquetEnquiryReport)
// banquet enquiry log
banquetRouter.route('/banquet-enquiry-log')
    .post(sanitize(), verifyJWTToken, BanquetEnquiryLogController.createEnquiryLog);

banquetRouter.route('/banquet-enquiry-log')
    .get(sanitize(), verifyJWTToken, BanquetEnquiryLogController.getEnquiryLogsByBanquetEnquiry);

