import { db } from '../../../models';
import sequelize, { NOW } from 'sequelize';
import moment from 'moment';
const Op = sequelize.Op
const excel = require("exceljs");

export default {
    async downloadReport(req, res) {
        const {fromDate, toDate, bookingStatus, propertyId} = req.query;
        const filter = {}
        if(fromDate && toDate){
            filter['createdAt'] = {
                [Op.between]: [moment(new Date(fromDate)).format('YYYY-MM-DD'), moment(new Date(toDate)).format('YYYY-MM-DD')]
            }
        }else if(fromDate){
            filter['createdAt'] = {
                [Op.gte]: moment(new Date(fromDate)).format('YYYY-MM-DD')
            }
        }else if(toDate){
            filter['createdAt'] = {
                [Op.lte]: moment(new Date(toDate)).format('YYYY-MM-DD')
            }
        }

        if(propertyId && propertyId > 0){
            filter['propertyId'] =  parseInt(propertyId)
        }

        if(bookingStatus){
            filter['bookingStatus'] =  parseInt(bookingStatus)
        }else{
            filter['bookingStatus'] = {[Op.not]: 0}
        }       

        const selection = {
            include: [
                { model: db.PropertyMaster, required: false, attributes: ['name', 'propertyCode']},
                { model: db.RroomCategory, required: false, attributes: ['name']},
                { model: db.User, required: false, attributes : ['name','email']},
            ],
            where : [filter],
            attributes: ['bookingCode', 'adults', 'source', 'checkInDateTime',
             'checkOutDateTime', 'noOfRooms', 'bookingHours', 'bookingAmout', 'totalFoodAmount', 'collectedPayment',
             'breakFast', 'paymentMode', 'bookingStatus', 'createdAt', 'otherPersonName'
            ]
        }
        const selector = Object.assign({}, selection);
        await db.BookingHotel.findAll(selector)
        .then(async result => {
            const bookingDetails = [];
            if(result && result.length > 0){
                result.forEach(element => {
                    bookingDetails.push({
                        bookingCode: element.bookingCode,
                        adults: element.adults,
                        source: element.source,
                        checkInDateTime: element.checkInDateTime,
                        checkOutDateTime: element.checkOutDateTime,
                        noOfRooms: element.noOfRooms,
                        //bookingHours: element.bookingHours,
                        bookingAmout: element.bookingAmout,
                        collectedPayment: element.collectedPayment,
                        breakFast: element.breakFast == 0 ? 'No' : 'Yes',
                        totalFoodAmount: element.totalFoodAmount,
                        //paymentMode: element.paymentMode ,
                        bookingStatus: element.bookingStatus == 1 ? "Upcoming" : element.bookingStatus == 2 ? "Checked- In" : element.bookingStatus == 3 ? "Checked-Out" : element.bookingStatus == 4 ? "Cancelled" : element.bookingStatus == 5 ? "No-Show" : element.bookingStatus == 6 ? "Call Not picked" : element.bookingStatus == 7 ? "Rejected" : "Pending",
                        createdAt: element.createdAt,
                        otherPersonName: element.otherPersonName ?? '',
                        propertyCode: element?.PropertyMaster?.propertyCode,
                        propertyName: element?.PropertyMaster?.name,
                        customerName: element?.User?.name,
                        customerEmail: element?.User?.email,
                        categoryName: element?.RroomCategory?.name
                    })
                });                
            }
            //Init excel
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet("Booking List");
            // Init Columns
            worksheet.columns = [
                { header: "Property Code", key: "propertyCode", width: 25 },
                { header: "Property Name", key: "propertyName", width: 35 },
                { header: "Category", key: "categoryName", width: 25 },
                { header: "Customer Name", key: "customerName", width: 25 },
                { header: "Guest Name", key: "otherPersonName", width: 25 },
                { header: "Booking Code", key: "bookingCode", width: 20 },
                { header: "Source", key: "source", width: 25 },
                { header: "Check In Date", key: "checkInDateTime", width: 20 },
                { header: "Check Out Date", key: "checkOutDateTime", width: 20 },
                { header: "No Of Rooms", key: "noOfRooms", width: 20 },
                //{ header: "For Hours", key: "bookingHours", width: 20 },
                { header: "Booking Amount", key: "bookingAmout", width: 20 },
                { header: "Collected Amount", key: "collectedPayment", width: 20 },
                { header: "Break Fast", key: "breakFast", width: 20 },
                { header: "Food Amount", key: "totalFoodAmount", width: 20 },
                //{ header: "Payment Mode", key: "paymentMode", width: 35 },
                { header: "Booking Date", key: "createdAt", width: 20 },
                { header: "Booking Status", key: "bookingStatus", width: 20 },
            ];
            // Add Array Rows
            worksheet.addRows(bookingDetails);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "booking_reports.xlsx"
            );
            return await workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            //return res.status(200).json({ data: bookingDetails, status: true});
        })
        .catch((err) => {
            return res.status(200).json({ status: false, message: err.message});
        });
    }
};
