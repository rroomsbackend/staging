import sequelize from 'sequelize';
import { db } from '../../../../models';
import moment from 'moment';
const excel = require("exceljs");
const Op = sequelize.Op;

export default {

    async getById(req, res) {
        const propertyId = req.params.id;
        if (!propertyId || propertyId <= 0) {
            return res.status(400).json({
                status: false,
                message: "Property ID must be provided and greater than 0."
            });
        }

        const result = await db.BookingHotel.findOne({ where: { propertyId: propertyId } })
        if (!result) {
            return res.status(404).json({
                status: false,
                message: `Booking details does not exist for property id:${propertyId}`
            });
        }
        const commissionDetail = await db.RRoomsCommission.findOne({
            where: { propertyId: propertyId },
            attributes: ['commissionPercentage']
        }).catch(err => {
            return res.status(err?.code ? err.code : 500).json({
                status: false,
                message: err?.message
            });
        })

        let commissionPercentage = commissionDetail?.get('commissionPercentage') ?? 20;

        await db.BookingHotel.findAll({
            where: { propertyId: propertyId, source: 'RRooms' },
            attributes: [
                [sequelize.literal('SUM(CASE WHEN bookingStatus = 2 THEN bookingAmout ELSE 0 END)'), 'totalCheckedInSale'],
                [sequelize.literal('SUM(CASE WHEN bookingStatus = 3 THEN bookingAmout ELSE 0 END)'), 'totalCheckedOutSale'],
                [sequelize.literal('SUM(CASE WHEN bookingStatus = 1 THEN bookingAmout ELSE 0 END)'), 'totalUpcomingSale']
            ]
        }).then(result => {
            const saleSummaryData = result[0].dataValues;

            const finalRes = {
                checked_in_sale: saleSummaryData.totalCheckedInSale,
                checked_out_sale: saleSummaryData.totalCheckedOutSale,
                upcoming_sale: saleSummaryData.totalUpcomingSale,
                checked_in_commission: Math.round(saleSummaryData.totalCheckedInSale * commissionPercentage) / 100,
                checked_out_commission: Math.round(saleSummaryData.totalCheckedOutSale * commissionPercentage) / 100,
                upcoming_sale_commission: Math.round(saleSummaryData.totalUpcomingSale * commissionPercentage) / 100,
            }

            res.status(200).json({
                status: true,
                data: finalRes
            });
        }).catch(err => {
            return res.status(err?.code ? err.code : 500).json({
                status: false,
                message: err?.message
            });
        })
    },

    async getSaleByMonth(req, res) {
        const { endDate, propertyId } = req.query;
        if (!propertyId || propertyId <= 0) {
            return res.status(400).json({
                status: false,
                message: "Property ID must be provided and greater than 0."
            });
        }

        if (!endDate) {
            return res.status(400).json({
                status: false,
                message: "Please provide any valid date of the month for which you want to get sales report."
            });
        }

        //let dateDiff = moment(new Date(endDate));
        // if (dateDiff.isBefore()) {
        //     return res.status(400).json({
        //         status: false,
        //         message: "Can not create invoice report for the current and up-coming month."
        //     });
        // }

        let date = moment(endDate, true);
        if (!date.isValid()) {
            return res.status(500).json({
                status: false,
                message: 'Invalid Date format. Server required YYYY-MM-DD date format.'
            });
        }

        var fromDate = moment(date).startOf('month').format('YYYY-MM-DD');
        var toDate = moment(date).endOf('month').format('YYYY-MM-DD');

        const filter = {}
        filter['toDate'] = { [Op.between]: [fromDate, toDate] }
        filter['propertyId'] = parseInt(propertyId)
        filter['bookingStatus'] = 3 // only checkout
        filter['source'] = 'RRooms'

        await db.BookingHotel.findAll({
            where: filter,
            attributes: [
                [sequelize.fn('sum', sequelize.col('bookingAmout')), 'totalSale']
            ]
        }).then(bookingDetails => {
            const finalRes = {
                total_sale: bookingDetails[0]?.dataValues?.totalSale ?? 0,
                from_date: fromDate,
                to_date: toDate,
                month: moment(fromDate).format('MMMM, YYYY')
            }
            return res.status(200).json({
                status: true,
                data: finalRes
            });
        }).catch(err => {
            console.log(err)
            return res.status(err?.code ? err.code : 500).json({
                status: false,
                message: err?.message
            });
        })
    },

    async saleExportToExcel(req, res) {
        const propertyId = req.params.id
        const { startDate, endDate } = req.query;

        if (!propertyId || propertyId <= 0) {
            return res.status(400).json({
                status: false,
                message: "Property ID must be provided and greater than 0."
            });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({
                status: false,
                message: "Please provide valid startDate and endDate params in YYYY-MM-DD format."
            });
        }

        if (!moment(startDate, true).isValid() || !moment(endDate, true).isValid()) {
            return res.status(500).json({
                status: false,
                message: 'Invalid Date format. Server required YYYY-MM-DD date format.'
            });
        }
        const commissionData = await db.RRoomsCommission.findOne({
            where: { propertyId: propertyId },
            attributes: ['commissionPercentage']
        }).catch(err => {
            return res.status(err?.code ? err.code : 500).json({
                status: false,
                message: err?.message
            });
        })
        let commissionPercentage = commissionData?.get('commissionPercentage') ?? 20;

        var fromDate = moment(startDate).startOf('month').format('YYYY-MM-DD');
        var toDate = moment(endDate).endOf('month').format('YYYY-MM-DD');

        const filter = {}
        filter['toDate'] = { [Op.between]: [fromDate, toDate] }
        filter['propertyId'] = parseInt(propertyId)
        filter['bookingStatus'] = 3 // only checkout
        filter['source'] = 'RRooms'

        const bookingDetails = await db.BookingHotel.findAll({
            where: filter,
            attributes: [
                [sequelize.literal('SUM(CASE WHEN paymentMode <> 1 THEN bookingAmout ELSE 0 END)'), 'cashBooking'],
                [sequelize.literal('SUM(CASE WHEN paymentMode = 1 THEN bookingAmout ELSE 0 END)'), 'onlineBooking'],
            ]
        }).catch(err => {
            return res.status(err?.code ? err.code : 500).json({
                status: false,
                message: err?.message
            });
        })

        if (bookingDetails) {
            const totalCashBooking = bookingDetails.length > 0 ? (bookingDetails[0].dataValues.cashBooking ?? 0) : 0;
            const totalOnlineBooking = bookingDetails.length > 0 ? (bookingDetails[0].dataValues.onlineBooking ?? 0) : 0;

            const totalBookingAmount = totalCashBooking + totalOnlineBooking;
            const commissionAmount = Math.round(totalBookingAmount * commissionPercentage) / 100;
            const gstOnCommission = Math.round(commissionAmount * 18) / 100;
            const tcsOnCommission = Math.round(commissionAmount * 1) / 100;
            const tdsOnCommission = Math.round(commissionAmount * 1) / 100;

            const totalAmount = totalOnlineBooking - (commissionAmount + gstOnCommission + tcsOnCommission + tdsOnCommission);

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Sale");

            worksheet.columns = [
                { header: "Particular", key: "particular", width: 40 },
                { header: "Amount(INR)", key: "amount", width: 25 },
                { header: "Booking Period", key: "date_label", width: 25 },
                { header: "", key: "date_value", width: 25 },
            ];
            worksheet.mergeCells('C1:D1');
            worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.addRow({ particular: 'Pay at Hotel', amount: totalCashBooking, date_label: 'From:', date_value: startDate });
            worksheet.addRow({ particular: 'Prepaid(A)', amount: totalOnlineBooking, date_label: 'To:', date_value: endDate });
            worksheet.addRow({ particular: 'Total', amount: totalBookingAmount });
            worksheet.addRow({ particular: 'Commission Amount(B)', amount: commissionAmount });
            worksheet.addRow({ particular: 'GST on Commission @ 18% (C)', amount: gstOnCommission });
            worksheet.addRow({ particular: 'TCS (D)', amount: tcsOnCommission });
            worksheet.addRow({ particular: 'TDS (E)', amount: tdsOnCommission });
            worksheet.addRow({ particular: 'Amount to be paid by Hotel (A-(B+C+D+E)', amount: totalAmount });

            // Making first line in excel bold
            worksheet.eachRow(function (row, rowNumber) {
                if (rowNumber == 1) {
                    row.eachCell(function (cell, colNumber) {
                        cell.font = { bold: true, size: 12, name: 'Calibri' };
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {
                                argb: 'FF7CA4DC'
                            },
                            bgColor: {
                                argb: 'FF7CA4DC',
                            },
                        };
                    });
                } else if (rowNumber == 9) {
                    row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
                        cell.font = { bold: true, size: 12, name: 'Calibri' };
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {
                                argb: 'FF4FAF18'
                            },
                            bgColor: {
                                argb: 'FF4FAF18',
                            },
                        };
                    });
                } else {
                    row.eachCell(function (cell, colNumber) {
                        cell.font = { size: 12, name: 'Calibri' };
                    });
                }
            });
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + `sale-report-${startDate}-${endDate}.xlsx`
            );

            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        } else {
            return res.status(404).json({
                status: false,
                message: `Booking details does not exist for property id:${propertyId}`
            });
        }
    },
};