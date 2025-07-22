import { createNewBooking, deleteBooking, getAllBookings, updateBooking } from "../restaurent-table-booking/restaurentTableBooking.service";

export const createRestaurantBooking = async (req, res) => {
    try {
        const restaurantBooking = await createNewBooking(req.body);
        return res.status(201).send({success: true, message: 'booking created succesfully', data: restaurantBooking})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};

export const getRestaurantAllBooking = async (req, res) => {
    try {
        const restaurantAllBookings = await getAllBookings(req.query);
        return res.status(200).send({success: true, message: 'fetched booking list succesfully', data: restaurantAllBookings})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};

export const getRestaurantBookingById = async (req, res) => {
    const { bookingId } = req.params;
    try {
        const restaurantBooking = await getRestaurantBookingById(bookingId);
        if (!restaurantBooking) {
            return res.status(404).json({success: false, message: 'Booking not found' });
        }
        return res.status(200).send({success: true, message: 'Booking details', data: restaurantBooking})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};

export const updateRestaurantBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRestaurantBookingResponse = await updateBooking(id, req.body);
        return res.status(200).send({success: true, message: 'updated succesfully', data: updatedRestaurantBookingResponse})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};

export const deleteRestaurantBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteBooking(id);
        return res.status(200).send({success: true, message: 'Restaurant Booking deleted successfully.'})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};
