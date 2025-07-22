import * as bookedServiceService from './bookedServiceService';

// Create a new BookedService
export const createBookedService = async (req, res) => {
    try {
        const bookedService = await bookedServiceService.createBookedService(req.body);
        return res.status(201).json({success: true, message: 'booked service succesfully',data: bookedService });
    } catch (error) {
        return res.status(500).json({succes: false, message: error.message });
    }
};

// Get all BookedServices
export const getAllBookedServices = async (req, res) => {
    try {
        const {propertyId, banquetBookingId} = req.query;
        const bookedServices = await bookedServiceService.getAllBookedServices(propertyId, banquetBookingId);
        return res.status(200).json({success: true, mesage: 'booked service list', data: bookedServices });
    } catch (error) {
        return res.status(500).json({succes: false, message: error.message });    }
};

// Get a single BookedService by ID
export const getBookedServiceById = async (req, res) => {
    try {
        const bookedService = await bookedServiceService.getBookedServiceById(req.params.id);
        return res.status(200).json({success: true, message: 'booked service details', data: bookedService });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};

// Update a BookedService
export const updateBookedService = async (req, res) => {
    try {
        const updatedBookedService = await bookedServiceService.updateBookedService(req.params.id, req.body);
        return res.status(200).json({succes: true, message: 'updated successfully', data: updatedBookedService });
    } catch (error) {
        return res.status(500).json({succes: false, message: error.message });
    }
};

// Delete a BookedService
export const deleteBookedService = async (req, res) => {
    try {
        await bookedServiceService.deleteBookedService(req.params.id);
        return res.status(200).send({succes: true, mesage: 'deleted successfully'});
    } catch (error) {
        return res.status(500).json({succes: false, message: error.message });
    }
};
