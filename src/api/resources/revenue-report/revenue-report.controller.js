import * as RevenueReportService from './revenue-report-service';
import moment from 'moment';
const excel = require("exceljs");

export const getRevenueReportByMonth = async (req, res) => {
    try {
        const { propertyId, month } = req.query;
        if (!propertyId || propertyId <= 0) {
            return res.status(400).json({
                status: false,
                message: "Property ID must be provided and greater than 0."
            });
        }

        if (!month) {
            return res.status(400).json({
                status: false,
                message: "Please provide any valid date of the month for which you want to get revenue report."
            });
        }
        let date = moment(month, true);
        if (!date.isValid()) {
            return res.status(500).json({
                status: false,
                message: 'Invalid Date format. Server required YYYY-MM-DD date format.'
            });
        }

        var fromDate = moment(date).startOf('month').format('YYYY-MM-DD');
        var toDate = moment(date).endOf('month').format('YYYY-MM-DD');

        const revenueReport = await RevenueReportService.getRevenueReportByMonth(propertyId, fromDate, toDate);

        return res.status(200).json({ succes: true, data: revenueReport });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const downloadRevenueReportByMonth = async (req, res) => {
    try {
        const { propertyId, month } = req.query;
        if (!propertyId || propertyId <= 0) {
            return res.status(400).json({
                status: false,
                message: "Property ID must be provided and greater than 0."
            });
        }
        if (!month) {
            return res.status(400).json({
                status: false,
                message: "Please provide any valid date of the month for which you want to get revenue report."
            });
        }
        let date = moment(month, true);
        if (!date.isValid()) {
            return res.status(500).json({
                status: false,
                message: 'Invalid Date format. Server required YYYY-MM-DD date format.'
            });
        }
        var fromDate = moment(date).startOf('month').format('YYYY-MM-DD');
        var toDate = moment(date).endOf('month').format('YYYY-MM-DD');
        const revenueReport = await RevenueReportService.getRevenueReportByMonth(propertyId, fromDate, toDate);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("RevenueReport");
        worksheet.columns = [
            { header: "Particular", key: "particular", width: 40 },
            { header: "Amount(INR)", key: "amount", width: 25 },
            { header: "Booking Period", key: "date_label", width: 25 },
            { header: "", key: "date_value", width: 25 },
        ];
        worksheet.mergeCells('C1:D1');
        worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
        //let totalSale = revenueReport['total_sale']
        // for (var key in totalSale) {
        //     if (totalSale.hasOwnProperty(key)) {
        //       var data = totalSale[key];
        //       worksheet.addRow({ particular: `Total ${data.source} sale`, amount: data.totalSale });
        //     }
        //   }
        worksheet.addRow({ particular: 'Total Sale RRooms', amount: revenueReport['total_sale_rrooms'], date_label: 'From:', date_value: fromDate });
        worksheet.addRow({ particular: 'Total Sale Walk-In', amount: revenueReport['total_sale_walk_in'], date_label: 'To:', date_value: toDate });
        worksheet.addRow({ particular: 'Total Sale OTA', amount: revenueReport['total_sale_ota'] });
        worksheet.addRow({ particular: 'Total Sale TA', amount: revenueReport['total_sale_ta'] });
        worksheet.addRow({ particular: 'Total Sale Sum', amount: revenueReport['total_sale_sum'] });
        worksheet.addRow({ particular: 'Total Expenses', amount: revenueReport['total_expense'] });
        worksheet.addRow({ particular: 'Total Commission', amount: revenueReport['total_commission'] });
        worksheet.addRow({ particular: 'Net Profit Sale - (expenses+rrooms commission)', amount: revenueReport['net_profit'] });
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
            "attachment; filename=" + `revenue-report-${fromDate}-${toDate}.xlsx`
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getRevenueReportByDate = async (req, res) => {
    try {
        const { propertyId, month } = req.query;
        if (!propertyId || propertyId <= 0) {
            return res.status(400).json({
                status: false,
                message: "Property ID must be provided and greater than 0."
            });
        }

        if (!month) {
            return res.status(400).json({
                status: false,
                message: "Please provide any valid date of the month for which you want to get revenue report."
            });
        }
        let date = moment(month, true);
        if (!date.isValid()) {
            return res.status(500).json({
                status: false,
                message: 'Invalid Date format. Server required YYYY-MM-DD date format.'
            });
        }

        var fromDate = moment(date).startOf('month').format('YYYY-MM-DD');
        var toDate = moment(date).endOf('month').format('YYYY-MM-DD');

        const revenueReport = await RevenueReportService.getRevenueReportByDate(propertyId, fromDate, toDate);

        return res.status(200).json({ succes: true, data: revenueReport });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const downloadRevenueReportByDate = async (req, res) => {
    try {
        const { propertyId, month } = req.query;
        console.log({ propertyId, month });
        if (!propertyId || propertyId <= 0) {
            return res.status(400).json({
                status: false,
                message: "Property ID must be provided and greater than 0."
            });
        }
        if (!month) {
            return res.status(400).json({
                status: false,
                message: "Please provide any valid date of the month for which you want to get revenue report."
            });
        }
        let date = moment(month, true);
        if (!date.isValid()) {
            return res.status(500).json({
                status: false,
                message: 'Invalid Date format. Server required YYYY-MM-DD date format.'
            });
        }
        var fromDate = moment(date).startOf('month').format('YYYY-MM-DD');
        var toDate = moment(date).endOf('month').format('YYYY-MM-DD');
        const revenueReportList = await RevenueReportService.getRevenueReportByDate(propertyId, fromDate, toDate);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("RevenueReport");
        worksheet.columns = [
            { header: "Date", key: "date", width: 40 },
            { header: "Total Sale RRooms", key: "total_sale_rrooms", width: 25 },
            { header: "Total Sale Walk-In", key: "total_sale_walk_in", width: 25 },
            { header: "Total Sale OTA", key: "total_sale_ota", width: 25 },
            { header: "Total Sale TA", key: "total_sale_ta", width: 25 },
            { header: "Total Sale SUM", key: "total_sale_sum", width: 25 },
            { header: "Total Expenses", key: "total_expense", width: 25 },
            { header: "Total Commission", key: "total_commission", width: 25 },
            { header: "Net Profit Sale - (expenses+rrooms commission)", key: "net_profit", width: 60 },
        ];
        //worksheet.mergeCells('C1:D1');
        //worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
        for (var key in revenueReportList) {
            if (revenueReportList.hasOwnProperty(key)) {
                var revenueReport = revenueReportList[key];
                worksheet.addRow({
                    date: revenueReport['date'],
                    total_sale_rrooms: revenueReport['total_sale_rrooms'],
                    total_sale_walk_in: revenueReport['total_sale_walk_in'],
                    total_sale_ota: revenueReport['total_sale_ota'],
                    total_sale_ta: revenueReport['total_sale_ta'],
                    total_sale_sum: revenueReport['total_sale_sum'],
                    total_expense: revenueReport['total_expense'],
                    total_commission: revenueReport['total_commission'],
                    net_profit: revenueReport['net_profit'],
                });
            }
        }
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
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
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
            "attachment; filename=" + `revenue-report-by-date-${fromDate}-${toDate}.xlsx`
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
