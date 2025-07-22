import * as venueService from './venue.service';

export const createVenue = async (req, res) => {
    const { propertyId, venueName, gstPercent } = req.body;
    try {
        const newVenue = await venueService.createVenue({ propertyId, venueName, gstPercent });
        return res.status(201).send({success: true, message: 'venue created successfully', data: newVenue})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const getAllVenues = async (req, res) => {
    try {
        const venues = await venueService.getAllVenues();
        return res.status(200).send({success: true, message: 'venue list fetched successfully', data: venues})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const getVenueById = async (req, res) => {
    const { id } = req.params;
    try {
        const venue = await venueService.getVenueById(id);
        return res.status(200).send({success: true, message: 'venue details by id fetched successfully', data: venue})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const updateVenueById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedVenue = await venueService.updateVenueById(id, updates);
        return res.status(200).send({success: true, message: 'updated successfully', data: updatedVenue})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message });
    }
};

export const deleteVenueById = async (req, res) => {
    const { id } = req.params;
    try {
        await venueService.deleteVenueById(id);
        return res.status(200).send({success: true, message: 'deleted successfully'})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};


export const getVenuesByPropertyId = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const venues = await venueService.getVenuesByPropertyId(propertyId);
        return res.status(200).send({success: true, message: 'venue list by propertyId fetched successfully', data: venues})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};