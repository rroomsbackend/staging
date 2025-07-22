import cron from 'node-cron';
import { db } from './models';
const { Op } = require('sequelize');

async function updateExpiredBookings() {
    try {
        const [affectedRows] = await db.BookingHotel.update(
            { bookingStatus: 5 },
            {
                where: {
                    bookingStatus: 1,
                    toDate: {
                        [Op.lt]: new Date().toISOString().split('T')[0]
                    }
                }
            }
        );

        console.log(`[${new Date().toISOString()}] Updated ${affectedRows} expired bookings.`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error updating expired bookings:`, error);
    }
}

cron.schedule('0 12 * * *', () => {
    console.log('Running cron job to update expired bookings...');
    updateExpiredBookings();
});

