// import { BookedService } from '../../../../models'; // Import the BookedService model
import  { db }  from '../../../../models/index'; // Import the BanquetBooking model
const { BookedService } = db;
// Create a new BookedService
export const createBookedService = async (bookedServiceData) => {
    try {
        const bookedService = await BookedService.create(bookedServiceData);
        return bookedService;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get all BookedServices
export const getAllBookedServices = async (propertyId, banquetBookingId) => {
    try {
        let whereClause = {};
    
        if (propertyId) {
            whereClause.propertyId = propertyId;
        }

        if (banquetBookingId) {
            whereClause.banquetBookingId = banquetBookingId;
        }

        const bookedServices = await BookedService.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC'],
                
            ],
        });
        return bookedServices;
    } catch (error) {
        console.error(error);;
        throw new Error(error.message);
    }
};


// Get a single BookedService by ID
export const getBookedServiceById = async (id) => {
    try {
        const bookedService = await BookedService.findByPk(id);
        if (!bookedService) {
            throw new Error('BookedService not found');
        }
        return bookedService;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update a BookedService
export const updateBookedService = async (id, bookedServiceData) => {
    try {
        const [updated] = await BookedService.update(bookedServiceData, {
            where: { bookedServiceID: id }
        });
        if (!updated) {
            throw new Error('BookedService not found');
        }
        const updatedBookedService = await BookedService.findByPk(id);
        return updatedBookedService;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete a BookedService
export const deleteBookedService = async (id) => {
    try {
        const deleted = await BookedService.destroy({
            where: { bookedServiceID: id }
        });
        if (!deleted) {
            throw new Error('BookedService not found');
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
