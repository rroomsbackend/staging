import { db } from '../../../models';
const Venue = db.Venue;


export const createVenue = async ({ propertyId, venueName, gstPercent }) => {
    try {
        return await Venue.create({ propertyId, venueName, gstPercent });
    } catch (error) {
        console.error(error)
        throw new Error('Unable to create venue');
    }
};

export const getAllVenues = async () => {
    try {
        return await Venue.findAll();
    } catch (error) {
        throw new Error('Unable to fetch venues');
    }
};

export const getVenueById = async (id) => {
    try {
        const venue = await Venue.findByPk(id);
        if (!venue) {
            throw new Error('Venue not found');
        }
        return venue;
    } catch (error) {
        throw new Error('Unable to fetch venue');
    }
};

export const updateVenueById = async (id, updates) => {
    try {
        const [updatedRowsCount, updatedRows] = await Venue.update(updates, {
            where: { venueId: id },
            returning: true,
        });
        if (updatedRowsCount === 0) {
            throw new Error('Venue not found');
        }
        return updatedRows[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteVenueById = async (id) => {
    try {
        const deletedRowCount = await Venue.destroy({ where: { venueId: id } });
        if (deletedRowCount === 0) {
            throw new Error('Venue not found');
        }
    } catch (error) {
        throw new Error('Unable to delete venue');
    }
};

export const getVenuesByPropertyId = async (propertyId) => {
    try {
        return await Venue.findAll({ where: { propertyId } });
    } catch (error) {
        throw new Error('Unable to fetch venues by propertyId');
    }
};
