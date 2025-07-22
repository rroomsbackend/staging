import { db } from '../../../models/index';

const  RestaurantBooking  = db.RestaurantBookings;

// Create a new booking
const createNewBooking = async (bookingData) => {
    try {
        const newBooking = await RestaurantBooking.create(bookingData);
        return newBooking;
    } catch (error) {
        throw new Error('Error creating booking: ' + error.message);
    }
};

// Get all bookings
const getAllBookings = async (query) => {
    try {
        const { propertyId } = query;
        
        const selection = {
            order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            where: {}
        };

        if (propertyId) selection.where["propertyId"] = propertyId;

        const bookings = await RestaurantBooking.findAll(selection);
        return bookings;
    } catch (error) {
        throw new Error('Error getting bookings: ' + error.message);
    }
};


// Get booking by ID
const getBookingById = async (bookingId) => {
    try {
        const booking = await RestaurantBooking.findByPk(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        return booking;
    } catch (error) {
        throw new Error('Error getting booking by ID: ' + error.message);
    }
};

// Update booking
const updateBooking = async (bookingId, updatedData) => {
    try {
        const booking = await RestaurantBooking.findByPk(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        await booking.update(updatedData);
        return booking;
    } catch (error) {
        throw new Error('Error updating booking: ' + error.message);
    }
};

// Delete booking
const deleteBooking = async (bookingId) => {
    try {
        const booking = await RestaurantBooking.findByPk(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        await booking.destroy();
        return 'Booking deleted successfully';
    } catch (error) {
        throw new Error('Error deleting booking: ' + error.message);
    }
};

export { createNewBooking, getAllBookings, getBookingById, updateBooking, deleteBooking };
