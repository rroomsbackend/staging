import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { validateInvoiceFormDataBody } from '../../src/api/resources/rrooms-property/hotel-finance/invoice.validation';

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION
})

const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname })
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        const fullPath = 'invoice_payment/' + fileName;
        console.log(fullPath)
        cb(null, fullPath);
    }
});

function sanitizeFile(file, cb) {
    const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    // Mime type must be an image
    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true); // no errors
    } else {
        return cb('Error: File type not allowed!', false);
    }
}

function sanitizeInvoiceProofFile(file, cb) {
    const fileExts = [".png", ".jpg", ".jpeg", ".pdf"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    if (isAllowedExt) {
        return cb(null, true); // no errors
    } else {
        return cb('Error: File type not allowed!', false);
    }
}

const uploadImageToS3 = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback)
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5mb file size
    }
})

const uploadInvoiceImageAndPdfS3 = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {

        if (validateInvoiceFormDataBody(req.body)) {
            callback(null, true)
        } else {
            return callback('invoice_id, payment_source, payment_date fields are required in form-data.', false)
        }
        if (file) {
            sanitizeInvoiceProofFile(file, callback)
        } else {
            return callback('Invoice payment proof required as an image or pdf file', true)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5mb file size
    }
})

const invoiceFileUploader = uploadInvoiceImageAndPdfS3.single('file');

export default (invoiceFileUploader);