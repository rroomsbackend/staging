import express from 'express';
import countryController from './country.controller';
import stateController from './state.controller';
import cityController from './city.controller';
import localityController from './locality.controller';
import hubController from './hub.controller';
import { sanitize } from '../../../middleware/sanitizer';
import multer from "multer";
import path from "path";
import { validateBody, schemas } from '../../../middleware/validator';
import { loginCheck } from '../../../middleware/auth';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const country = express.Router();

import fs from "fs";


// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "../../../uploads/cities");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save images in the "uploads/cities" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

// Set limits (e.g., max file size: 2MB)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("city_img");

// Middleware to handle errors
const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Handle multer-specific errors
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ status: false, message: "File size exceeds 2MB limit!" });
            }
            return res.status(400).json({ status: false, message: err.message });
        } else if (err) {
            // Handle other errors (e.g., file type)
            return res.status(400).json({ status: false, message: err.message });
        }
        next();
    });
};

//Country Route
country.route('/country').post(sanitize(), countryController.create)
country.route('/country/:id').put(sanitize(), countryController.update)
country.route('/country').get(sanitize(), countryController.get)
country.route('/country/:id').get(sanitize(), countryController.getById)
country.route('/country/:id').delete(sanitize(), countryController.delete)

//State Route
country.route('/state').post(sanitize(), stateController.create)
country.route('/state/:id').put(sanitize(), stateController.update)
country.route('/state').get(sanitize(), stateController.get)
country.route('/state/:id').get(sanitize(), stateController.getById)
country.route('/state-country/:id').get(sanitize(), stateController.getByCountryId)
country.route('/state/:id').delete(sanitize(), stateController.delete)

//City Route
country.route('/city').post(sanitize(), uploadMiddleware, cityController.create)
country.route('/city/:id').put(sanitize(), uploadMiddleware, cityController.update)
country.route('/city').get(sanitize(), cityController.get)
country.route('/city/:id').get(sanitize(), cityController.getById)
country.route('/city-state/:id').get(sanitize(), cityController.getCityByStateId)
country.route('/city/:id').delete(sanitize(), cityController.delete)

//Locality Route
country.route('/locality').post(sanitize(), localityController.create)
country.route('/locality/:id').put(sanitize(), localityController.update)
country.route('/locality').get(sanitize(), localityController.get)
country.route('/locality/:id').get(sanitize(), localityController.getById)
country.route('/locality-city/:id').get(sanitize(), localityController.getByCityId)
country.route('/locality/:id').delete(sanitize(), localityController.delete)  

// Hubs and Zone
country.route('/hub').post(sanitize(), hubController.create);
country.route('/hub/:id').put(sanitize(), hubController.update);
country.route('/hubs-by-state/:state_id').get(sanitize(), hubController.getHubsByStateId);
country.route('/get-all-zone').get(sanitize(), hubController.getAllZone);
country.route('/state-by-zone/:zone_id').get(sanitize(), hubController.getStateByZoneId);
country.route('/city-by-hub/:hub_id').get(sanitize(), hubController.getCitiesByHubId);