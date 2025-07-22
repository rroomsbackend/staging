import { db } from '../../../../models/index'; // Import Sequelize models

const { BanquetEnquiryLog } = db;

export const createEnquiryLog = async (logData) => {
    return BanquetEnquiryLog.create(logData);
};

export const getEnquiryLogsByBanquetEnquiry = async (propertyId, banquetEnquiryId) => {
    let whereCondition = {};

    if (propertyId) {
        whereCondition.propertyId = propertyId;
    }

    if (banquetEnquiryId) {
        whereCondition.banquetEnquiryId = banquetEnquiryId;
    }

    try {
        const enquiryLogs = await BanquetEnquiryLog.findAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],
        });
        return enquiryLogs;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

