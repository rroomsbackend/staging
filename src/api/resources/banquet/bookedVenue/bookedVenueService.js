// import { BookedVenue } from '../../../../models'; // Import the BookedVenue model
import  { db }  from '../../../../models/index'; // Import the BanquetBooking model
const { BookedVenue, Venue, Function } = db;
// Create a new BookedVenue
export const createBookedVenue = async (bookedVenueData) => {
    try {
        const bookedVenue = await BookedVenue.create(bookedVenueData);
        return bookedVenue;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get all BookedVenues
export const getAllBookedVenues = async (propertyId, banquetBookingId, reservedDate, reserveStartTime) => {
    try {
        let whereClause = {}; 

        if (propertyId) {
            whereClause.propertyId = propertyId;
        }

        if (banquetBookingId) {
            whereClause.banquetBookingId = banquetBookingId;
        }

        if (reservedDate) {
            whereClause.reservedDate = reservedDate;
        }

        if (reserveStartTime) {
            whereClause.reserveStartTime = reserveStartTime;
        }

        const bookedVenues = await BookedVenue.findAll({
            where: whereClause, 
            order: [
                ['createdAt', 'DESC'],
            ],
            include: [{
                model: Venue,
                attributes: ['venueId', 'venueName'],
                required: true,
            },
            {
                model: Function,
                attributes: ['id', 'functionName']
            }
        ],
        });
        return bookedVenues;
    } catch (error) {
        throw new Error(error.message);
    }
};


// Get a single BookedVenue by ID
export const getBookedVenueById = async (id) => {
    try {
        const bookedVenue = await BookedVenue.findByPk(id, {
            include: [{
                model: Venue,
                attributes: ['venueName'],
                required: true,
            }],
        });
        if (!bookedVenue) {
            throw new Error('BookedVenue not found');
        }
        return bookedVenue;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update a BookedVenue
export const updateBookedVenue = async (id, bookedVenueData) => {
    try {
        const [updated] = await BookedVenue.update(bookedVenueData, {
            where: { bookedVenueID: id }
        });
        if (!updated) {
            throw new Error('BookedVenue not found');
        }
        const updatedBookedVenue = await BookedVenue.findByPk(id);
        return updatedBookedVenue;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete a BookedVenue
export const deleteBookedVenue = async (id) => {
    try {
        const deleted = await BookedVenue.destroy({
            where: { bookedVenueID: id }
        });
        if (!deleted) {
            throw new Error('BookedVenue not found');
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
