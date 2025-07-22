import { db } from '../../../../models/index';
import { Op } from 'sequelize';
import { createExcelSheet } from '../../../../utils/createExcelSheet'
import * as ExcelJS from 'exceljs';

const { BanquetBooking, Function, Venue } = db;

// Create a new BanquetBooking
export const createBanquetBooking = async (banquetBookingData) => {
    try {
        // Generate a unique booking code automatically
        const lastBooking = await BanquetBooking.findOne({
            order: [['createdAt', 'DESC']],
            paranoid: true
        });
        const lastBookingCode = lastBooking ? lastBooking.bookingCode : 'BANQ10000'; // Initial code if no previous bookings
        const nextBookingCode = 'BANQ' + (parseInt(lastBookingCode?.substring(4)) + 1);

        banquetBookingData.bookingCode = nextBookingCode;

        return await BanquetBooking.create(banquetBookingData);
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};


// Get all BanquetBookings
export const getAllBanquetBookings = async (search, propertyId, bookingCode, enquiryCode, mobile, paymentStatus, bookingStatus, reserveBookingDate, limit, offset) => {
    let whereClause = {};

    if (search) {
        whereClause[Op.or] = [
            { customerName: { [Op.like]: `%${search}%` } },
            // { bookingCode: { [Op.like]: `%${search}%` } },
            // { enquiryCode: { [Op.like]: `%${search}%` } },
            // { mobile: { [Op.like]: `%${search}%` } },
        ];
    }

    if (propertyId) {
        whereClause.propertyId = propertyId;
    }

    if (bookingCode) {
        whereClause.bookingCode = bookingCode;
    }

    if (enquiryCode) {
        whereClause.enquiryCode = enquiryCode;
    }

    if (mobile) {
        whereClause.mobile = mobile;
    }

    if (paymentStatus) {
        whereClause.paymentStatus = paymentStatus;
    }

    if (bookingStatus) {
        whereClause.bookingStatus = bookingStatus;
    }

    if (reserveBookingDate) {
        whereClause.reserveBookingDate = reserveBookingDate;
    }

    try {
        const banquetBookings = await BanquetBooking.findAndCountAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC'],
            ],
            limit,
            offset,
            include: [
                {
                    model: Function,
                    attributes: ['id', 'functionName']
                },
                {
                    model: Venue,
                    attributes: ['venueId', 'venueName']
                }
            ]
        });
        return banquetBookings;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};


// Get a single BanquetBooking by ID
export const getBanquetBookingById = async (id) => {
    try {
        const banquetBooking = await BanquetBooking.findByPk(id, {
            include: [
                {
                    model: Function,
                    attributes: ['id', 'functionName']
                },
                {
                    model: Venue,
                    attributes: ['venueId', 'venueName']
                }
            ]
        });
        if (!banquetBooking) {
            throw new Error('BanquetBooking not found');
        }
        return banquetBooking;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Update a BanquetBooking
export const updateBanquetBooking = async (id, banquetBookingData) => {
    try {
        const [updated] = await BanquetBooking.update(banquetBookingData, {
            where: { banquetBookingID: id }
        });
        if (!updated) {
            throw new Error('BanquetBooking not found');
        }
        const updatedBanquetBooking = await BanquetBooking.findByPk(id);
        return updatedBanquetBooking;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Delete a BanquetBooking
export const deleteBanquetBooking = async (id) => {
    try {
        const deleted = await BanquetBooking.destroy({
            where: { banquetBookingID: id }
        });
        if (!deleted) {
            throw new Error('BanquetBooking not found');
        }
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// donload reoprt
export const downloadBanquetBookingReport = async (query) => {
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
        let banquetBookings = await BanquetBooking.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC'],
            ],
            include: [
                {
                    model: Function,
                    attributes: ['functionName']
                },
                {
                    model: Venue,
                    attributes: ['venueName']
                }
            ],
            raw: true,

        });
        banquetBookings = banquetBookings.map(obj => {
            obj["functionName"] = obj["Function.functionName"]
            obj["venueName"] = obj["Venue.venueName"]
            delete obj["Venue.venueName"]
            delete obj["Function.functionName"]
            return obj;
        })
        return await createExcelSheet(banquetBookings);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};
