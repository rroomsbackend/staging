import { db } from '../../../models';
import sequelize from 'sequelize';
import moment from 'moment';
const Op = sequelize.Op

export const getRevenueReportByDate = async (propertyId, fromDate, toDate) => {
    try {
        const filter = {}
        filter['toDate'] = { [Op.between]: [fromDate, toDate] }
        filter['propertyId'] = parseInt(propertyId)
        filter['bookingStatus'] = 3 // only checkout
        filter['deletedAt'] = null
        const bookingDetails = await db.BookingHotel.findAll({
            where: filter,
            attributes: ['toDate', 'bookingAmout', 'source'],
            order: [
                ['toDate', 'ASC'],
            ],
        })
        const groupedData = bookingDetails.reduce((acc, curr) => {
            const date = curr.toDate.slice(0, 10); // Extract YYYY-MM-DD
            if (!acc[date]) {
                acc[date] = [];
            }
            // Find if the source already exists for the current date
            const existingSource = acc[date].find(item => item.source === curr.source);
            if (existingSource) {
                // If source exists, sum the bookingAmount
                existingSource.bookingAmount += curr.bookingAmout;
            } else {
                // If source does not exist, add a new entry
                acc[date].push({ 'date': date, 'bookingAmount': curr.bookingAmout, 'source': curr.source });
            }
            return acc;
        }, {});
        const expenseFilter = {}
        expenseFilter['dateTime'] = { [Op.between]: [fromDate, toDate] }
        expenseFilter['propertyId'] = parseInt(propertyId)
        const expenseData = await db.DailyExpense.findAll({
            where: expenseFilter,
            attributes: [
                [sequelize.fn('DATE', sequelize.col('dateTime')), 'date'],
                [sequelize.fn('sum', sequelize.col('amount')), 'totalExpense']
            ],
            group: ['date']
        })
        const expenseMap = {};
        expenseData.forEach(item => {
            expenseMap[item.dataValues.date] = parseInt(item.dataValues.totalExpense);
        });
        const commissionData = await db.RRoomsCommission.findOne({
            where: { propertyId: propertyId },
            attributes: ['commissionPercentage']
        })
        const commissionPercentage = commissionData?.get('commissionPercentage') ?? 20;
        const finalRes = Object.keys(groupedData).map((date) => {
            const totalExpense = expenseMap.hasOwnProperty(date) ? expenseMap[date] : 0;
            const bookingData = groupedData[date] ?? [];
            const rroomsDataList = bookingData.filter(detail => detail.source === 'RRooms');
            const totalSaleRrooms = rroomsDataList.length > 0 ? rroomsDataList.reduce((acc, booking) => acc + booking.bookingAmount, 0) : 0;
            const dataListOTA = bookingData.filter(detail => detail.source.startsWith('OTA-'));
            const totalSaleOTA = dataListOTA.length > 0 ? dataListOTA.reduce((acc, booking) => acc + booking.bookingAmount, 0) : 0;
            const dataListTA = bookingData.filter(detail => detail.source.startsWith('TA-'));
            const totalSaleTA = dataListTA.length > 0 ? dataListTA.reduce((acc, booking) => acc + booking.bookingAmount, 0) : 0;
            const dataListWalkIn = bookingData.filter(detail => detail.source === 'Walk-In');
            const totalSaleWalkIn = dataListWalkIn.length > 0 ? dataListWalkIn.reduce((acc, booking) => acc + booking.bookingAmount, 0) : 0;
            const totalSaleSum = bookingData.reduce((acc, detail) => acc + detail.bookingAmount, 0);
            const totalCommission = Math.round(totalSaleRrooms * commissionPercentage) / 100;
            const netProfit = totalSaleSum - (totalCommission + totalExpense);
            return {
                date: date,
                total_expense: totalExpense,
                total_sale_rrooms: totalSaleRrooms,
                total_sale_walk_in: totalSaleWalkIn,
                total_sale_ota: totalSaleOTA,
                total_sale_ta: totalSaleTA,
                total_sale_sum: totalSaleSum,
                total_commission: totalCommission,
                net_profit: netProfit
            }
        });
        return finalRes;
    } catch (error) {
        console.error(error);
        throw new Error('Unable to fetch revenue report.');
    }
};

export const getRevenueReportByMonth = async (propertyId, fromDate, toDate) => {
    try {
        const filter = {}
        filter['toDate'] = { [Op.between]: [fromDate, toDate] }
        filter['propertyId'] = parseInt(propertyId)
        filter['bookingStatus'] = 3 // only checkout
        filter['deletedAt'] = null

        const bookingDetails = await db.BookingHotel.findAll({
            where: filter,
            attributes: [
                'source',
                [sequelize.fn('sum', sequelize.col('bookingAmout')), 'totalSale']
            ],
            group: ['source']
        })

        const bookingDetailsList = bookingDetails.map(detail => detail.dataValues);
        const rroomsDataList = bookingDetailsList.filter(detail => detail.source === 'RRooms');
        const totalSaleRrooms = rroomsDataList.length > 0 ? rroomsDataList[0].totalSale : 0;
        const dataListOTA = bookingDetailsList.filter(detail => detail.source.startsWith('OTA-'));
        const totalSaleOTA = dataListOTA.length > 0 ? dataListOTA[0].totalSale : 0;
        const dataListTA = bookingDetailsList.filter(detail => detail.source.startsWith('TA-'));
        const totalSaleTA = dataListTA.length > 0 ? dataListTA[0].totalSale : 0;
        const dataListWalkIn = bookingDetailsList.filter(detail => detail.source === 'Walk-In');
        const totalSaleWalkIn = dataListWalkIn.length > 0 ? dataListWalkIn[0].totalSale : 0;

        const totalSaleSum = bookingDetailsList.reduce((acc, detail) => acc + detail.totalSale, 0);

        const expenseFilter = {}
        expenseFilter['dateTime'] = { [Op.between]: [fromDate, toDate] }
        expenseFilter['propertyId'] = parseInt(propertyId)

        const expenseData = await db.DailyExpense.findAll({
            where: expenseFilter,
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'totalExpense']
            ]
        })

        const totalExpense = expenseData[0]?.dataValues?.totalExpense ?? 0;

        const commissionData = await db.RRoomsCommission.findOne({
            where: { propertyId: propertyId },
            attributes: ['commissionPercentage']
        })

        const commissionPercentage = commissionData?.get('commissionPercentage') ?? 20;
        const totalCommission = Math.round(totalSaleRrooms * commissionPercentage) / 100;
        const netProfit = totalSaleSum - (totalCommission + totalExpense);

        const finalRes = {
            month: moment(fromDate).format('MMMM, YYYY'),
            total_expense: totalExpense,
            total_sale_rrooms: totalSaleRrooms,
            total_sale_walk_in: totalSaleWalkIn,
            total_sale_ota: totalSaleOTA,
            total_sale_ta: totalSaleTA,
            total_sale_sum: totalSaleSum,
            total_commission: totalCommission,
            net_profit: netProfit
        }
        return finalRes;
    } catch (error) {
        console.error(error);
        throw new Error('Unable to fetch revenue report.');
    }
};