import { db } from '../../../../models/index'; // Import Sequelize models
import { createExcelSheet } from '../../../../utils/createExcelSheet'
import * as ExcelJS from 'exceljs';
import { Op } from 'sequelize';
const { BanquetEnquiry } = db;

export const getAllBanquetEnquiries = async (propertyId, enquiryCode, enquiryType, functionType, status, eventDate, limit, offset) => {
    let whereCondition = {};

    if (propertyId) {
        whereCondition.propertyId = propertyId;
    }
    if (enquiryCode) {
        whereCondition.enquiryCode = enquiryCode;
    }
    if (enquiryType) {
        whereCondition.enquiryType = enquiryType;
    }
    if (functionType) {
        whereCondition.functionType = functionType;
    }
    if (status) {
        whereCondition.status = status;
    }
    if (eventDate) {
        whereCondition.eventDate = eventDate;
    }

    try {
        const enquiries = await BanquetEnquiry.findAndCountAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        return enquiries;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};


export const getBanquetEnquiryById = async (id) => {
    try {
        return await BanquetEnquiry.findByPk(id);
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const createBanquetEnquiry = async (enquiryData) => {
    try {
        // Generate a unique enquiryCode automatically
        const lastEnquiry = await BanquetEnquiry.findOne({
            order: [['banquetEnquiryId', 'DESC']],
            paranoid: true,
        });
        //console.log("lastEnquiry", lastEnquiry.enquiryCode);
        const lastEnquiryCode = lastEnquiry ? lastEnquiry.enquiryCode : 'ENQ10000'; // Initial code if no previous enquiries
        const nextEnquiryCode = 'ENQ' + (parseInt(lastEnquiryCode?.substring(3)) + 1);

        enquiryData.enquiryCode = nextEnquiryCode;

        return await BanquetEnquiry.create(enquiryData);
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const updateBanquetEnquiry = async (id, enquiryData) => {
    try {
        const enquiry = await BanquetEnquiry.findByPk(id);
        if (!enquiry) {
            throw new Error('Banquet enquiry not found');
        }
        return await enquiry.update(enquiryData);
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const deleteBanquetEnquiry = async (id) => {
    try {
        const enquiry = await BanquetEnquiry.findByPk(id);
        if (!enquiry) {
            throw new Error('Banquet enquiry not found');
        }
        await enquiry.destroy();
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// download enquiry report
export const downloadBanquetEnquiryReport = async (query) => {
    const { propertyId, fromDate, toDate } = query;
    let whereClause = {};

    if (propertyId) {
        whereClause.propertyId = propertyId;
    }

    if (fromDate && toDate) {
        whereClause.createdAt = {
            [Op.between]: [new Date(fromDate), new Date(toDate)]
        };
    }

    try {
        let banquetBookings = await BanquetEnquiry.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC'],
            ],
            raw: true,

        });

        return await createExcelSheet(banquetBookings);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};
