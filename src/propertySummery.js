import cron from 'node-cron';
import { db } from './models';
const { sequelize } = db;
const PropertySummery = db.PropertySummery;

async function savePropertyStatusSnapshot() {
    try {
        const [results] = await sequelize.query(`
            SELECT 
                pm.id AS propertyId,
                pm.name AS propertyName,
                pm.propertyCode AS propertyCode, 
                pm.ownerEmail AS ownerEmail, 
                pm.ownerFirstName AS ownerFirstName, 
                pm.ownerLastName AS ownerLastName, 
                pm.ownerMobile AS ownerMobile, 
                pm.propertyEmailId AS propertyEmailId, 
                pm.propertyMobileNumber AS propertyMobileNumber, 
                pm.createdAt AS createdAt,
                pm.noOfRooms AS noOfRooms, 
                pm.approved AS approved, 
                pm.status AS status, 
                pm.locality AS locality, 
                c.name AS cityName, 
                s.name AS stateName, 
                h.hubname AS hubName, 
                pm.zone AS zone,
                pm.roomsCommission AS roomsCommission, 
                pm.approvedBy AS approvedBy, 
                pm.createdBy AS createdBy, 
                pm.reSubmitted AS reSubmitted, 
                pm.onboarded_date AS onboarded_date,
                pm.onboarded_date AS live_date, 
                pm.remarks AS remarks, 
                pm.agreement AS agreement,
                CONCAT(ruc.firstName, ' ', ruc.lastName) AS createdByName,
                CONCAT(rua.firstName, ' ', rua.lastName) AS approvedByName,
                -- Computed metrics
                CASE 
                    WHEN pm.status IN (0, 2, 3) THEN pm.onboardedRooms
                    ELSE COUNT(rd.id)
                END AS SRC,
                CASE 
                    WHEN pm.status = 2 THEN 'Sold Out'
                    WHEN pm.status = 3 THEN 'Blocked'
                    WHEN pm.status = 0 THEN 'Pending'
                    ELSE 'Live'
                END AS propertyStatus,
                MAX(
                    CASE 
                        WHEN pm.status = 0 THEN pm.onboardedRooms
                        ELSE 0
                    END
                ) AS PendingRooms,
                CASE 
                    WHEN pm.status = 1 THEN SUM(CASE WHEN rd.status IN (0, 2) THEN 1 ELSE 0 END)
                    ELSE 0
                END AS LiveRooms,
                CASE 
                    WHEN pm.status = 2 THEN pm.onboardedRooms
                    WHEN pm.status = 1 THEN SUM(CASE WHEN rd.status = 1 THEN 1 ELSE 0 END)
                    ELSE 0
                END AS SoldOutRooms,
                CASE 
                    WHEN pm.status = 3 THEN pm.onboardedRooms
                    WHEN pm.status = 1 THEN SUM(CASE WHEN rd.status = 3 THEN 1 ELSE 0 END)
                    ELSE 0
                END AS BlockedRooms
            FROM propertymasters pm
            LEFT JOIN rooms r ON r.propertyId = pm.id AND r.deletedAt IS NULL
            LEFT JOIN roomdetails rd ON rd.roomId = r.id AND rd.deletedAt IS NULL
            LEFT JOIN cities c ON c.id = pm.cityId
            LEFT JOIN states s ON s.id = pm.stateId
            LEFT JOIN hubs h ON h.id = pm.hub
            LEFT JOIN rroomsusers rua ON rua.id = pm.approvedBy
            LEFT JOIN rroomsusers ruc ON ruc.id = pm.createdBy
            WHERE pm.deletedAt IS NULL
            GROUP BY pm.id, pm.name, pm.status, pm.onboardedRooms, c.name, s.name, h.hubname
            ORDER BY pm.id DESC;
        `)
        for (const row of results) {
            await PropertySummery.create(row);
        }
    } catch (err) {
        console.error("Error in savePropertyStatusSnapshot cron:", err);
    }
}

cron.schedule("0 0 * * *", () => {
    console.log("Running property status cron...");
    savePropertyStatusSnapshot();
});