import { tasksUrl } from 'twilio/lib/jwt/taskrouter/util';
import * as bookedVenueService from './bookedVenueService';

// Create a new BookedVenue
export const createBookedVenue = async (req, res) => {
    try {
        const bookedVenue = await bookedVenueService.createBookedVenue(req.body);
        return res.status(201).json({success: true, message: 'venue booked succesfully', data: bookedVenue });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};

// Get all BookedVenues
export const getAllBookedVenues = async (req, res) => {
    try {
        const {propertyId, banquetBookingId, reservedDate, reserveStartTime} = req.query;
        const bookedVenues = await bookedVenueService.getAllBookedVenues(propertyId, banquetBookingId, reservedDate, reserveStartTime);
        return res.status(200).json({success: true, message: 'booked venue list', data: bookedVenues });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};

// Get a single BookedVenue by ID
export const getBookedVenueById = async (req, res) => {
    try {
        const bookedVenue = await bookedVenueService.getBookedVenueById(req.params.id);
        return res.status(200).json({success: true, message: 'booked venue details', data: bookedVenue });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};

// Update a BookedVenue
export const updateBookedVenue = async (req, res) => {
    try {
        const updatedBookedVenue = await bookedVenueService.updateBookedVenue(req.params.id, req.body);
        return res.status(200).json({success: true, message: 'upated succesfully', data: updatedBookedVenue });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};

// Delete a BookedVenue
export const deleteBookedVenue = async (req, res) => {
    try {
        await bookedVenueService.deleteBookedVenue(req.params.id);
        return res.status(200).send({succes: true, message: 'deleted successfully'});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};
