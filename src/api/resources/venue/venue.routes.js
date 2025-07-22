import express from 'express';
import * as venueController from './venue.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { verifyJWTToken } from '../../../middleware/Authentication';

export const venueRouter = express.Router();

venueRouter.route('/')
    .get(sanitize(), verifyJWTToken, venueController.getAllVenues)
    .post(sanitize(), verifyJWTToken, venueController.createVenue);

venueRouter.route('/:id')
    .get(sanitize(), verifyJWTToken, venueController.getVenueById)
    .put(sanitize(), verifyJWTToken, venueController.updateVenueById)
    .delete(sanitize(), verifyJWTToken, venueController.deleteVenueById);

venueRouter.route('/property/:propertyId')
    .get(sanitize(), verifyJWTToken, venueController.getVenuesByPropertyId);

