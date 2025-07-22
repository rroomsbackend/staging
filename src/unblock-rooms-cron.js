import cron from "node-cron";
import { Op } from "sequelize";
import { db } from './models';

// Function to update room_detail where fromdate and todate are in the past
const updateRoomDetails = async () => {
    try {
        const currentDate = new Date().toISOString().split("T")[0];
        const result = await db.RoomDetails.update(
            { fromDate: null, toDate: null, status: 0 },
            {
                where: {
                    fromDate: { [Op.lt]: currentDate }, // Update if fromdate < current date
                    toDate: { [Op.lt]: currentDate },   // Update if todate < current date
                    status: 3
                },
            }
        );
        console.log(`Room details updated successfully: ${result[0]} rows affected.`);
    } catch (error) {
        console.error("Error updating room_detail table:", error);
    }
};

// Schedule cron job to run every 12 hours
cron.schedule("0 */12 * * *", async () => {
// cron.schedule("1 * * * * *", async () => {
    console.log("Running scheduled task...");
    await updateRoomDetails();
});