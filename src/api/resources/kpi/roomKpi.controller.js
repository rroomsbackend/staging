import { db } from '../../../models';
import sequelize, { NOW } from 'sequelize';
const Op = sequelize.Op
import moment from 'moment';
import { createAtDateFormat } from '../../../utils/date-query';
const excel = require("exceljs");

const paymentMode = (paymentMode) => {
    switch (paymentMode) {
        case 1:
            return 'PREPAID';
        case 2:
            return 'CASH';
        case 3:
            return 'CARD';
        case 4:
            return 'FOC';
        case 5:
            return 'UPI';
        case 6:
            return 'PAYLATER';
        case 7:
            return 'PREPAID';
        default:
            return 'CASH';
    }
}

export default {
    // async roomCountWithStatus(req, res) {
    //     const { propertyId, status, categoryId } = req.body;
    //     const filter = {}
    //     const roomDetailsFilter = {}
    //     if (propertyId && propertyId > 0) {
    //         filter['propertyId'] = parseInt(propertyId)
    //     }
    //     if (status) {
    //         roomDetailsFilter['status'] = parseInt(status)
    //     }
    //     if (categoryId) {
    //         filter['categoryId'] = parseInt(categoryId)
    //     }
    //     const roomIds = await db.Rooms.findAll({ attributes: ["id"], where: filter }).map(u => u.get("id"));
    //     roomDetailsFilter['roomId'] = roomIds;
    //     await db.RoomDetails.findAll({ where: roomDetailsFilter, attributes: ["status", [sequelize.fn('count', sequelize.col('id')), 'totalRooms']], group: ['status'] }).then(result => {
    //         return res.status(200).json({ status: true, data: result });
    //     }).catch(error => {
    //         return res.status(400).json({ status: false, message: error.message });
    //     });
    // },
    async roomCountWithStatus(req, res) {
        const { propertyId, status, categoryId } = req.body;
        const filter = {};
        const roomDetailsFilter = {};
        if (propertyId && propertyId > 0) {
            filter['propertyId'] = parseInt(propertyId);
        }
        if (categoryId) {
            filter['categoryId'] = parseInt(categoryId);
        }
        const roomIds = await db.Rooms.findAll({
            attributes: ["id"],
            where: filter
        }).then(rooms => rooms.map(u => u.get("id")));
        if (!roomIds.length) {
            return res.status(200).json({
                status: true,
                data: [
                    { status: 0, totalRooms: 0 },
                    { status: 1, totalRooms: 0 },
                    { status: 2, totalRooms: 0 },
                    { status: 3, totalRooms: 0 }
                ]
            });
        }
        if (status !== undefined && status !== null) {
            roomDetailsFilter['status'] = parseInt(status);
        }
        roomDetailsFilter['roomId'] = roomIds;
        const rawData = await db.RoomDetails.findAll({
            where: roomDetailsFilter,
            attributes: ["status", [sequelize.fn('count', sequelize.col('id')), 'totalRooms']],
            group: ['status'],
            raw: true
        });
        const allStatuses = [0, 1, 2, 3];
        const result = allStatuses.map(s => {
            const found = rawData.find(r => parseInt(r.status) === s);
            return {
                status: s,
                totalRooms: found ? parseInt(found.totalRooms) : 0
            };
        });
        return res.status(200).json({ status: true, data: result });
    },

    async bookingCountWithStatus(req, res) {
        const { startDate, endDate, propertyId } = req.body;
        const filter = {}
        const filterTodayCheckout = {}

        if (propertyId && propertyId > 0) {
            filter['propertyId'] = parseInt(propertyId)
            filterTodayCheckout['propertyId'] = parseInt(propertyId)
        }

        if (startDate && endDate) {
            filter['fromDate'] = {
                [Op.between]: [moment(new Date(startDate)).format('YYYY-MM-DD'), moment(new Date(endDate)).format('YYYY-MM-DD')]
            }
        }

        //For Checkout Result 
        const currentHrMn = moment(new Date()).format('HH:MM')
        filterTodayCheckout['bookingStatus'] = 2
        let todayCheckoutResult = null
        const time1 = Date.parse(currentHrMn)
        const time2 = Date.parse('11:00') // checkout time AM               
        const from = startDate ? moment(startDate).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')
        let to = endDate ? moment(endDate).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')

        if (time1 > time2) {
            if (to > from) {
                to = to.subtract(1, "days").format("YYYY-MM-DD");
            }
        }

        filterTodayCheckout['toDate'] = {
            [Op.between]: [from, to]
        }

        await db.BookingHotel.findAll({ where: filterTodayCheckout, attributes: ["bookingStatus", [sequelize.fn('count', sequelize.col('id')), 'totalBooking'], [sequelize.fn('sum', sequelize.col('collectedPayment')), 'totalCollectedAmount']], group: ['bookingStatus'] }).then(result => {
            todayCheckoutResult = JSON.parse(JSON.stringify(result))[0];
        }).catch(err => {
            console.log(err.message);
        })

        //End forcheckout result

        await db.BookingHotel.findAll({ where: filter, attributes: ["bookingStatus", [sequelize.fn('count', sequelize.col('id')), 'totalBooking'], [sequelize.fn('sum', sequelize.col('collectedPayment')), 'totalCollectedAmount'], 'source'], group: ['bookingStatus', 'source'] }).then(result => {
            const data = JSON.parse(JSON.stringify(result));
            let mapData = []
            if (data && data.length > 0) {
                const pendingData = data.filter(obj => {
                    return obj.bookingStatus == 0;
                })
                //console.log('pendingData',pendingData)                
                const confirmData = data.filter(obj => {
                    return obj.bookingStatus == 1;
                })
                //console.log('confirmData',confirmData)
                const checkedInData = data.filter(obj => {
                    return obj.bookingStatus == 2;
                })
                // console.log('checkedInData',checkedInData)
                const checkedOutData = data.filter(obj => {
                    return obj.bookingStatus == 3;
                })
                //console.log('checkedOutData',checkedOutData)
                const cancelledData = data.filter(obj => {
                    return obj.bookingStatus == 4;
                })
                //console.log('cancelledData',cancelledData)
                const noShowData = data.filter(obj => {
                    return obj.bookingStatus == 5;
                })
                // console.log('noShowData',noShowData)
                const callNotpickedData = data.filter(obj => {
                    return obj.bookingStatus == 6;
                })
                //console.log('callNotpickedData',callNotpickedData)
                mapData = [
                    {
                        "bookingStatus": 'Pending',
                        "rroomsTotalBooking": pendingData?.filter((obj) => obj.source === 'RRooms')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "rroomsTotalCollectedAmount": pendingData?.filter((obj) => obj.source === 'RRooms')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),

                        "walkInTotalBooking": pendingData?.filter((obj) => obj.source === 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "walkInTotalCollectedAmount": pendingData?.filter((obj) => obj.source === 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "otaTotalBooking": pendingData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "otaTotalCollectedAmount": pendingData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "totalBooking": pendingData?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "totalCollectedAmount": pendingData?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                    },
                    {
                        "bookingStatus": 'Confirmed',
                        "rroomsTotalBooking": confirmData?.filter((obj) => obj.source === 'RRooms')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "rroomsTotalCollectedAmount": confirmData?.filter((obj) => obj.source === 'RRooms')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),

                        "walkInTotalBooking": confirmData?.filter((obj) => obj.source === 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "walkInTotalCollectedAmount": confirmData?.filter((obj) => obj.source === 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "otaTotalBooking": confirmData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "otaTotalCollectedAmount": confirmData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "totalBooking": confirmData?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "totalCollectedAmount": confirmData?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                    },
                    {
                        "bookingStatus": 'Checked-In',
                        "rroomsTotalBooking": checkedInData?.filter((obj) => obj.source === 'RRooms')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "rroomsTotalCollectedAmount": checkedInData?.filter((obj) => obj.source === 'RRooms')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),

                        "walkInTotalBooking": checkedInData?.filter((obj) => obj.source === 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "walkInTotalCollectedAmount": checkedInData?.filter((obj) => obj.source === 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "otaTotalBooking": checkedInData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "otaTotalCollectedAmount": checkedInData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "totalBooking": checkedInData?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "totalCollectedAmount": checkedInData?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                    },
                    {
                        "bookingStatus": 'Checked-Out',
                        "rroomsTotalBooking": checkedOutData?.filter((obj) => obj.source === 'RRooms')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "rroomsTotalCollectedAmount": checkedOutData?.filter((obj) => obj.source === 'RRooms')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),

                        "walkInTotalBooking": checkedOutData?.filter((obj) => obj.source === 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "walkInTotalCollectedAmount": checkedOutData?.filter((obj) => obj.source === 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "otaTotalBooking": checkedOutData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "otaTotalCollectedAmount": checkedOutData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "totalBooking": checkedOutData?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "totalCollectedAmount": checkedOutData?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                    },
                    {
                        "bookingStatus": 'Cancelled',
                        "rroomsTotalBooking": cancelledData?.filter((obj) => obj.source === 'RRooms')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "rroomsTotalCollectedAmount": cancelledData?.filter((obj) => obj.source === 'RRooms')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),

                        "walkInTotalBooking": cancelledData?.filter((obj) => obj.source === 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "walkInTotalCollectedAmount": cancelledData?.filter((obj) => obj.source === 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "otaTotalBooking": cancelledData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "otaTotalCollectedAmount": cancelledData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "totalBooking": cancelledData?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "totalCollectedAmount": cancelledData?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                    },
                    {
                        "bookingStatus": 'No-Show',
                        "rroomsTotalBooking": noShowData?.filter((obj) => obj.source === 'RRooms')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "rroomsTotalCollectedAmount": noShowData?.filter((obj) => obj.source === 'RRooms')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),

                        "walkInTotalBooking": noShowData?.filter((obj) => obj.source === 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "walkInTotalCollectedAmount": noShowData?.filter((obj) => obj.source === 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "otaTotalBooking": noShowData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "otaTotalCollectedAmount": noShowData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "totalBooking": noShowData?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "totalCollectedAmount": noShowData?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                    },
                    {
                        "bookingStatus": 'Call Not Picked',
                        "rroomsTotalBooking": callNotpickedData?.filter((obj) => obj.source === 'RRooms')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "rroomsTotalCollectedAmount": callNotpickedData?.filter((obj) => obj.source === 'RRooms')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),

                        "walkInTotalBooking": callNotpickedData?.filter((obj) => obj.source === 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "walkInTotalCollectedAmount": callNotpickedData?.filter((obj) => obj.source === 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "otaTotalBooking": callNotpickedData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "otaTotalCollectedAmount": callNotpickedData?.filter((obj) => obj.source !== 'RRooms' && obj.source !== 'Walk-In')?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                        "totalBooking": callNotpickedData?.reduce((total, booking) => {
                            return total = total + booking.totalBooking
                        }, 0),
                        "totalCollectedAmount": callNotpickedData?.reduce((amount, collected) => {
                            return amount = amount + collected.totalCollectedAmount
                        }, 0),
                    },
                    {
                        "bookingStatus": "For-Checkout",
                        "totalBooking": todayCheckoutResult ? todayCheckoutResult?.totalBooking : 0,
                        "totalCollectedAmount": todayCheckoutResult ? todayCheckoutResult?.totalCollectedAmount : 0
                    }
                ]
            }

            return res.status(200).json({ status: true, data: mapData });
        }).catch(error => {
            return res.status(400).json({ status: false, message: error.message });
        });
    },

    async propertyCountWithStatus(req, res) {
        const { startDate, endDate, propertyId } = req.body;
        const filter = {}
        const approvedAndRejected = {}
        if (propertyId && propertyId > 0) {
            filter['id'] = parseInt(propertyId)
        }

        if (startDate && endDate) {
            filter['createdAt'] = {
                [Op.between]: [moment(new Date(startDate + ' 00:00:00')).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(endDate + ' 23:59:59')).format('YYYY-MM-DD HH:mm:ss')]
            }
            approvedAndRejected['createdAt'] = {
                [Op.between]: [moment(new Date(startDate + ' 00:00:00')).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(endDate + ' 23:59:59')).format('YYYY-MM-DD HH:mm:ss')]
            }
        }

        filter['deletedAt'] = null
        approvedAndRejected['deletedAt'] = null

        try {
            //Active/Inactive Property
            const statusWise = await db.PropertyMaster.findAll({ where: filter, attributes: ["status", [sequelize.fn('count', sequelize.col('id')), 'totalProperty']], group: ['status'] });
            //Approved and Rejected Property
            const approvedAndRejectedProperty = await db.PropertyMaster.findAll({ where: approvedAndRejected, attributes: ["approved", [sequelize.fn('count', sequelize.col('id')), 'totalProperty']], group: ['approved'] });
            const data = {
                activeInactiveProprty: statusWise ? JSON.parse(JSON.stringify(statusWise)) : [],
                approvedRejected: approvedAndRejectedProperty ? JSON.parse(JSON.stringify(approvedAndRejectedProperty)) : []
            }
            return res.status(200).json({ status: true, data: data });
        } catch (err) {
            return res.status(400).json({ status: false, message: err.message });
        }
    },

    async foodOrderCountWithStatus(req, res) {
        const { fromDate, toDate, propertyId, bookingId, ncType } = req.body;
        const filter = {}

        // if (propertyId && propertyId > 0) {
        //     filter['propertyId'] = parseInt(propertyId)
        // }

        if (bookingId && bookingId > 0) {
            filter['bookingId'] = parseInt(bookingId)
        }

        if (ncType && ncType > 0) {
            filter['ncType'] = parseInt(ncType)
        }

        if (fromDate && toDate) {
            filter['createdAt'] = {
                [Op.between]: [moment(new Date(fromDate)).format('YYYY-MM-DD'), moment(new Date(toDate)).format('YYYY-MM-DD')]
            }
        }

        await db.FoodOrder.findAll({ where: filter, attributes: ["orderStatus", [sequelize.fn('count', sequelize.col('id')), 'totalOrder'], [sequelize.fn('sum', sequelize.col('orderAmount')), 'totalOrderAmount'], [sequelize.fn('sum', sequelize.col('paidAmount')), 'totalPaidAmount']], group: ['orderStatus'] }).then(result => {
            return res.status(200).json({ status: true, data: result });
        }).catch(error => {
            return res.status(400).json({ status: false, message: error.message });
        });
    },

    // upload krna hai
    async downloadBookingReport(req, res) {
        const { fromDate, toDate, bookingStatus, propertyId, source, dateType = "fromDate", userType } = req.query;
        const filter = {}
        if (fromDate && toDate) {
            const dateKey =
                dateType === "checkIn" ? "checkInDateTime" :
                    dateType === "checkOut" ? "checkOutDateTime" :
                        dateType === "toDate" ? "toDate" : "fromDate";
            if (dateType === "checkIn" || dateType === "checkOut") {
                filter[dateKey] = {
                    [Op.between]: [
                        moment(fromDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                        moment(toDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                    ]
                };
            } else {
                filter[dateKey] = {
                    [Op.between]: [
                        moment(fromDate).format('YYYY-MM-DD'),
                        moment(toDate).format('YYYY-MM-DD')
                    ]
                };
            }
        }
        if (propertyId && propertyId != "" && propertyId > 0) {
            filter['propertyId'] = parseInt(propertyId)
        }
        if (bookingStatus && bookingStatus != "") {
            filter['bookingStatus'] = parseInt(bookingStatus)
        } else {
            filter['bookingStatus'] = { [Op.not]: 0 }
        }
        if (source) {
            filter['source'] = source
        }
        const selection = {
            include: [
                {
                    model: db.PropertyMaster, required: false, attributes: ['name', 'propertyCode', 'zone'],
                    include: [
                        { model: db.states, required: false, attributes: ['id', 'name'] },
                        { model: db.Hub, required: false, attributes: ['id', 'hubname'] },
                        { model: db.cities, required: false, attributes: ['id', 'name'] },
                        { model: db.Rooms, required: false, attributes: ['propertyId', 'categoryId', 'breakFastPrice'] },
                    ]
                },
                { model: db.RroomCategory, required: false, attributes: ['name'] },
                { model: db.User, required: false, attributes: ['name', 'email', 'mobile'] }
            ],
            where: filter,
            attributes: ['id', 'bookingCode', 'source', 'fromDate', 'toDate', 'checkInDateTime', 'propertyId', 'propertyRoomsCategoryId',
                'checkOutDateTime', 'noOfRooms', 'bookingHours', 'bookingAmout', 'totalFoodAmount', 'collectedPayment',
                'paymentMode', 'bookingStatus', 'adults', 'createdAt', 'breakFast', 'otherPersonName', 'assignRoomNo', 'otherPersonNumber', 'otaBookingId', 'referenceName', 'PaymentStatus', 'dueAmount', 'partialPayAmount', 'fullPayAmount', 'payAtHotelAmount'
            ],
            logging: console.log
        }
        const selector = Object.assign({}, selection);
        const x = await db.BookingHotel.findAll(selector)
            .then(async result => {
                const bookingDetails = [];
                if (result && result.length > 0) {
                    result.forEach((element, key) => {
                        const bookingAmountExclusive = (element.bookingAmout / 1.12).toFixed(2);
                        const OTAserviceFee = bookingAmountExclusive * 5 / 100;
                        const bookingAmountInclusive = element.bookingAmout;
                        const totalAmountMinMealPrice = element.bookingAmout
                        const bookingAmountGstMealPlanAmount = (totalAmountMinMealPrice / 1.12).toFixed(2);
                        const gst12 = (bookingAmountGstMealPlanAmount * 0.12)?.toFixed(2);
                        // const rroomsCommision20 = element?.source == 'RRooms' && element?.otaBookingId == null
                        //     ? (parseFloat(bookingAmountGstMealPlanAmount) * 0.15).toFixed(2)
                        //     : element?.source == 'RRooms' && element?.otaBookingId != null
                        //         ? (parseFloat(bookingAmountGstMealPlanAmount) * 0.25).toFixed(2) : 0;
                        const rroomsCommision20 = (element?.bookingStatus == 3 || element?.bookingStatus == 2) && element?.source == 'RRooms'
                            ? element?.otaBookingId == null
                                ? (parseFloat(bookingAmountGstMealPlanAmount) * 0.15).toFixed(2)
                                : (parseFloat(bookingAmountGstMealPlanAmount) * 0.25).toFixed(2)
                            : 0;
                        const gstOnCommision = element?.source === 'RRooms'
                            ? (parseFloat(rroomsCommision20) * 0.18).toFixed(2)
                            : 0;
                        const fromDate = new Date(element?.fromDate);
                        const toDate = new Date(element?.toDate);
                        const forTCS = element?.partialPayAmount || element?.fullPayAmount
                        const tcs = forTCS
                            ? (forTCS * 0.5) / 100
                            : 0;
                        const tds = element.paymentMode == 1 || element.paymentMode == 7
                            ? tcs * 2
                            : 0;
                        const cid = element.bookingStatus == 6 ? element.bookingAmout * 2 : 0;
                        var time_difference = toDate.getTime() - fromDate.getTime();
                        var days_difference = time_difference / (1000 * 60 * 60 * 24);
                        days_difference = days_difference > 0 ? days_difference : 1
                        var actualCheckOut = element?.bookingStatus == 3 ? element?.checkOutDateTime : "-"
                        bookingDetails.push({
                            zone: element?.PropertyMaster?.zone,
                            state: element?.PropertyMaster?.state?.name,
                            hub: element?.PropertyMaster?.Hub?.hubname,
                            city: element?.PropertyMaster?.city?.name,
                            propertyCode: element?.PropertyMaster?.propertyCode,
                            propertyName: element?.PropertyMaster?.name,
                            customerName: element?.User?.name ?? element.otherPersonName ?? '',
                            customerEmail: element?.User?.email,
                            customerMobile: element?.User?.mobile ?? element.otherPersonNumber ?? '',
                            bookingID: element?.id,
                            bookingCode: element?.source == 'Walk-In' || (element?.source == 'RRooms' && element?.otaBookingId == null) || element?.source?.startsWith('TA-') ? element.bookingCode : element.bookingCode + '/' + element?.otaBookingId,
                            source: element?.source?.startsWith('TA-') || element?.source?.startsWith('OTA') ? element?.source?.split('-')[0] : element.source,
                            referenceName: element?.referenceName ? element?.referenceName : element?.source?.startsWith('OTA') ? element?.source?.split('-')[1] : '-',
                            bookingStatus: element?.bookingStatus == 1 ? "Upcoming" : element?.bookingStatus == 2 ? "Checked- In" : element?.bookingStatus == 3 ? "Complete" : element?.bookingStatus == 4 ? "Cancelled" : element?.bookingStatus == 5 ? "No-Show" : element?.bookingStatus == 6 ? "Call Not picked" : element?.bookingStatus == 7 ? "Rejected" : "Pending",
                            createdAt: moment(element.createdAt).format('YYYY-MM-DD'),
                            checkInDateTime: element.fromDate,
                            checkOutDateTime: element.toDate,
                            noOfRooms: element.noOfRooms,
                            bookingHours: element.noOfRooms * days_difference,
                            categoryName: element?.RroomCategory?.name,
                            assignRoomNo: element?.assignRoomNo,
                            // paymentMode: element?.paymentMode == 1 || element?.paymentMode == 7 ? 'Prepaid' : 'Pay at Hotel',
                            // paymentStatus: element?.PaymentStatus == 0 && element?.collectedPayment != null ? 'Partial Pay' : element?.paymentMode == 1 && element?.collectedPayment == null && element?.PaymentStatus == 0 ? 'Payment Faild' : element?.PaymentStatus == 1 && element?.dueAmount == 0 ? 'Full Paid' : '',
                            ////
                            RROOMS_OTA_Paid: element?.partialPayAmount || element?.fullPayAmount,
                            paymentMode: element?.partialPayAmount ? "Part Pay" : element?.fullPayAmount && !element?.payAtHotelAmount ? 'Prepaid' : 'Pay at Hotel',
                            // fullPayAmount: element?.fullPayAmount,
                            // dueAmount: element?.dueAmount,
                            // collectedPayment: element?.collectedPayment,
                            ////
                            totalBookingAmount: element?.bookingAmout > 0 ? element?.bookingAmout : 0,
                            payAtHotelAmount: element?.payAtHotelAmount || element?.bookingAmout - (element?.partialPayAmount || element?.fullPayAmount),
                            bookingAmountInclusive: bookingAmountInclusive > 0 ? bookingAmountInclusive : 0,
                            mealPrice: element.breakFast == 0 ? 'NILL' : element.breakFast == 1 ? 'CP' : element.breakFast == 2 ? 'AP' : element.breakFast == 3 ? 'MAP' : 'NILL',
                            bookingAmountGstMealPlanAmount: bookingAmountGstMealPlanAmount > 0 ? bookingAmountGstMealPlanAmount : 0,
                            gst12: gst12 > 0 ? Number(gst12) : 0,
                            rroomsCommision: rroomsCommision20 > 0 ? Number(rroomsCommision20) : 0,
                            gstOnCommision: gstOnCommision > 0 ? Number(gstOnCommision) : 0,
                            noOfGuest: element?.adults,
                            tcs: Number(tcs.toFixed(2)),
                            tds: Number(tds.toFixed(2)),
                            cid: cid.toFixed(2),
                            rroomsTakeRate: element?.source == 'RRooms' && element?.otaBookingId == null ? 15
                                : element?.source == 'RRooms' && element?.otaBookingId != null ? 25 : 0,
                            bookingAmountExclusive: Number(bookingAmountExclusive),
                            OTAserviceFee: element?.source == 'RRooms' && element?.otaBookingId != null ? OTAserviceFee : "-",
                            actualCheckOut: actualCheckOut
                        })
                    });
                }
                const workbook = new excel.Workbook();
                const worksheet = workbook.addWorksheet("Booking List");
                let columns;
                if (userType == 'rroomUser') {
                    columns = [
                        { header: "Zone", key: "zone", width: 15 },
                        { header: "State", key: "state", width: 15 },
                        { header: "Hub", key: "hub", width: 15 },
                        { header: "City", key: "city", width: 18 },
                        { header: "Property Code", key: "propertyCode", width: 18 },
                        { header: "Property Name", key: "propertyName", width: 35 },
                        { header: "Customer / Guest Name", key: "customerName", width: 25 },
                        { header: "Customer Mobile", key: "customerMobile", width: 25 },
                        { header: "Customer Email", key: "customerEmail", width: 25 },
                        { header: "Booking Code", key: "bookingCode", width: 15 },
                        { header: "Source", key: "source", width: 15 },
                        { header: "TA/OTA", key: "referenceName", width: 15 },
                        { header: "Booking Status", key: "bookingStatus", width: 15 },
                        { header: "Booking Date", key: "createdAt", width: 15 },
                        { header: "Check In Date", key: "checkInDateTime", width: 15 },
                        { header: "Check Out Date", key: "checkOutDateTime", width: 15 },
                        { header: "Actual Check Out Date", key: "actualCheckOut", width: 25 },
                        { header: "Room Count", key: "noOfRooms", width: 15 },
                        { header: "Room Night", key: "bookingHours", width: 15 },
                        { header: "No Of Guest", key: "noOfGuest", width: 15 },
                        { header: "Room Type", key: "categoryName", width: 25 },
                        { header: "Meal Plan (Amount)", key: "mealPrice", width: 20 },
                        { header: "Room No.", key: "assignRoomNo", width: 18 },
                        { header: "Payment Mode", key: "paymentMode", width: 18 },
                        { header: "RROOMS/OTA", key: "RROOMS_OTA_Paid", width: 18 },
                        { header: "Pay At Hotel", key: "payAtHotelAmount", width: 18 },
                        { header: "Total Booking Amount", key: "totalBookingAmount", width: 22 },
                        { header: "Booking Amount(Exclusive GST)", key: "bookingAmountExclusive", width: 30 },
                        { header: "GST @ 12%", key: "gst12", width: 15 },
                        { header: "RROOMS/OTA Take Rate %", key: "rroomsTakeRate", width: 22 },
                        { header: "Rrooms/OTA Commission", key: "rroomsCommision", width: 20 },
                        { header: "GST on Commission @ 18%", key: "gstOnCommision", width: 25 },
                        { header: "Platform Fee", key: "0", width: 20 },
                        { header: "TCS", key: "tcs", width: 12 },
                        { header: "TDS", key: "tds", width: 12 },
                        { header: "CID", key: "cid", width: 12 }
                    ];
                } else {
                    columns = [
                        { header: "Property Code", key: "propertyCode", width: 18 },
                        { header: "Property Name", key: "propertyName", width: 35 },
                        { header: "Customer / Guest Name", key: "customerName", width: 25 },
                        { header: "Booking Code", key: "bookingCode", width: 15 },
                        { header: "Source", key: "source", width: 15 },
                        { header: "TA/OTA", key: "referenceName", width: 15 },
                        { header: "Booking Status", key: "bookingStatus", width: 15 },
                        { header: "Booking Date", key: "createdAt", width: 15 },
                        { header: "Check In Date", key: "checkInDateTime", width: 15 },
                        { header: "Check Out Date", key: "checkOutDateTime", width: 15 },
                        { header: "Actual Check Out Date", key: "actualCheckOut", width: 25 },
                        { header: "Room Count", key: "noOfRooms", width: 15 },
                        { header: "Room Night", key: "bookingHours", width: 15 },
                        { header: "No Of Guest", key: "noOfGuest", width: 15 },
                        { header: "Room Type", key: "categoryName", width: 25 },
                        { header: "Meal Plan (Amount)", key: "mealPrice", width: 20 },
                        { header: "Room No.", key: "assignRoomNo", width: 18 },
                        { header: "Payment Mode", key: "paymentMode", width: 18 },
                        { header: "RROOMS/OTA", key: "RROOMS_OTA_Paid", width: 18 },
                        { header: "Pay At Hotel", key: "payAtHotelAmount", width: 18 },
                        { header: "Total Booking Amount", key: "totalBookingAmount", width: 22 },
                        { header: "Booking Amount(Exclusive GST)", key: "bookingAmountExclusive", width: 30 },
                        { header: "GST @ 12%", key: "gst12", width: 15 },
                        // { header: "RROOMS/OTA Take Rate %", key: "rroomsTakeRate", width: 22 },
                        // { header: "Rrooms/OTA Commission", key: "rroomsCommision", width: 20 },
                        // { header: "GST on Commission @ 18%", key: "gstOnCommision", width: 25 },
                        // { header: "Plateform Fee", key: "0", width: 20 },
                        // { header: "TCS", key: "tcs", width: 12 },
                        // { header: "TDS", key: "tds", width: 12 },
                        // { header: "CID", key: "cid", width: 12 }
                    ];
                }
                // const columns = [
                //     { header: "Zone", key: "zone", width: 15 },
                //     { header: "State", key: "state", width: 15 },
                //     { header: "Hub", key: "hub", width: 15 },
                //     { header: "City", key: "city", width: 18 },
                //     { header: "Property Code", key: "propertyCode", width: 18 },
                //     { header: "Property Name", key: "propertyName", width: 35 },
                //     { header: "Customer / Guest Name", key: "customerName", width: 25 },
                // ];
                // if (userType == 'rroomUser') {
                //     columns.push(
                //         { header: "Customer Mobile", key: "customerMobile", width: 25 },
                //         { header: "Customer Email", key: "customerEmail", width: 25 }
                //     );
                // }
                // columns.push(
                // { header: "Booking Code", key: "bookingCode", width: 15 },
                // { header: "Source", key: "source", width: 15 },
                // { header: "TA/OTA", key: "referenceName", width: 15 },
                // { header: "Booking Status", key: "bookingStatus", width: 15 },
                // { header: "Booking Date", key: "createdAt", width: 15 },
                // { header: "Check In Date", key: "checkInDateTime", width: 15 },
                // { header: "Check Out Date", key: "checkOutDateTime", width: 15 },
                // { header: "Actual Check Out Date", key: "actualCheckOut", width: 25 },
                // { header: "Room Count", key: "noOfRooms", width: 15 },
                // { header: "Room Night", key: "bookingHours", width: 15 },
                // { header: "No Of Guest", key: "noOfGuest", width: 15 },
                // { header: "Room Type", key: "categoryName", width: 25 },
                // { header: "Meal Plan (Amount)", key: "mealPrice", width: 20 },
                // { header: "Room No.", key: "assignRoomNo", width: 18 },
                // { header: "Payment Mode", key: "paymentMode", width: 18 },
                // { header: "RROOMS/OTA", key: "RROOMS_OTA_Paid", width: 18 },
                // { header: "Pay At Hotel", key: "payAtHotelAmount", width: 18 },
                // { header: "Total Booking Amount", key: "totalBookingAmount", width: 22 },
                // { header: "Booking Amount(Exclusive GST)", key: "bookingAmountExclusive", width: 30 },
                // { header: "GST @ 12%", key: "gst12", width: 15 },
                // { header: "RROOMS/OTA Take Rate %", key: "rroomsTakeRate", width: 22 },
                // { header: "Rrooms/OTA Commission", key: "rroomsCommision", width: 20 },
                // { header: "GST on Commission @ 18%", key: "gstOnCommision", width: 25 },
                // { header: "Plateform Fee", key: "0", width: 20 },
                // { header: "TCS", key: "tcs", width: 12 },
                // { header: "TDS", key: "tds", width: 12 },
                // { header: "CID", key: "cid", width: 12 }
                // { header: "Payment Status", key: "paymentStatus", width: 18 },
                // { header: "Full Pay Amount", key: "fullPayAmount", width: 18 },
                // { header: "Due Amount", key: "dueAmount", width: 18 },
                // { header: "Collected Payment", key: "collectedPayment", width: 18 },
                // );
                // if (userType == 'rroomUser') {
                //     columns.push(                        
                //         { header: "CID", key: "cid", width: 12 }
                //     );
                // }
                worksheet.columns = columns;
                worksheet.getColumn('actualCheckOut').numFmt = 'yyyy-mm-dd hh:mm:ss';
                worksheet.getRow(1).font = { bold: true, size: 12 };
                const lastColIndex = worksheet.columns.length;
                const lastColLetter = worksheet.getColumn(lastColIndex).letter;
                worksheet.autoFilter = {
                    from: 'A1',
                    to: `${lastColLetter}1`
                };
                worksheet.addRows(bookingDetails);
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "booking_report.xlsx"
                );
                return await workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
            })
            .catch((err) => {
                return res.status(200).json({ status: false, message: err.message });
            });
        // return res.status(200).json({ status: true, data: x });
    },

    async downloadBookingPaymentReport(req, res) {
        const { fromDate, toDate, bookingStatus, propertyId } = req.query;
        const filter = {}
        if (fromDate && toDate) {
            filter['fromDate'] = {
                [Op.between]: [moment(new Date(fromDate)).format('YYYY-MM-DD'), moment(new Date(toDate)).format('YYYY-MM-DD')]
            }
        } else if (fromDate) {
            filter['fromDate'] = {
                [Op.gte]: moment(new Date(fromDate)).format('YYYY-MM-DD')
            }
        } else if (toDate) {
            filter['fromDate'] = {
                [Op.lte]: moment(new Date(toDate)).format('YYYY-MM-DD')
            }
        }

        if (propertyId && propertyId > 0) {
            filter['propertyId'] = parseInt(propertyId)
        }

        if (bookingStatus) {
            filter['bookingStatus'] = parseInt(bookingStatus)
        } else {
            filter['bookingStatus'] = { [Op.not]: 0 }
        }

        const selection = {
            include: [
                { model: db.Payment, required: false, attributes: ['paymentAmount', 'paymentMode', 'paymentDate', 'transactionID'] },
            ],
            where: [filter],
            attributes: ['bookingCode', 'paymentMode', 'bookingAmout']
        }
        const selector = Object.assign({}, selection);
        await db.BookingHotel.findAll(selector)
            .then(async result => {
                //return res.status(200).json({ status: false, data: result, message: ''});
                const bookingDetails = [];
                if (result && result.length > 0) {
                    result.forEach(element => {
                        bookingDetails.push({
                            bookingCode: element.bookingCode,
                            paymentMode: paymentMode(element?.Payment?.paymentMode),
                            bookingAmout: element.bookingAmout,
                            paymentDate: element?.Payment?.paymentDate,
                            paymentAmount: element?.Payment?.paymentAmount,
                            transactionID: element?.Payment?.transactionID
                        })
                    });
                }
                //Init excel
                const workbook = new excel.Workbook();
                const worksheet = workbook.addWorksheet("Booking Payment List");
                // Init Columns
                worksheet.columns = [
                    { header: "Booking Code", key: "bookingCode", width: 20 },
                    { header: "Booking Amount", key: "bookingAmout", width: 20 },
                    { header: "Payment Amount", key: "paymentAmount", width: 25 },
                    { header: "Payment Mode", key: "paymentMode", width: 25 },
                    { header: "Payment Date", key: "paymentDate", width: 25 },
                    { header: "Transaction ID", key: "transactionID", width: 25 },

                ];
                // Add Array Rows
                worksheet.addRows(bookingDetails);
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "booking_payment_report.xlsx"
                );
                return await workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
                //return res.status(200).json({ data: bookingDetails, status: true});
            })
            .catch((err) => {
                return res.status(200).json({ status: false, message: err.message });
            });
    },

    async downloadFoodPaymentReport(req, res) {
        const { fromDate, toDate, bookingStatus, propertyId } = req.query;
        const filter = {}
        if (fromDate && toDate) {
            filter['fromDate'] = {
                [Op.between]: [moment(new Date(fromDate)).format('YYYY-MM-DD'), moment(new Date(toDate)).format('YYYY-MM-DD')]
            }
        } else if (fromDate) {
            filter['fromDate'] = {
                [Op.gte]: moment(new Date(fromDate)).format('YYYY-MM-DD')
            }
        } else if (toDate) {
            filter['fromDate'] = {
                [Op.lte]: moment(new Date(toDate)).format('YYYY-MM-DD')
            }
        }

        if (propertyId && propertyId > 0) {
            filter['propertyId'] = parseInt(propertyId)
        }

        if (bookingStatus) {
            filter['bookingStatus'] = parseInt(bookingStatus)
        } else {
            filter['bookingStatus'] = { [Op.not]: 0 }
        }

        const selection = {
            include: [
                { model: db.FoodOrderPayment, required: true, attributes: ['orderId', 'transactionId', 'paymentAmount', 'paymentMode', 'createdAt'], where: [{ bookingId: { [Op.gte]: 0 } }, { orderId: { [Op.gte]: 0 } }] },
            ],
            where: [filter],
            attributes: ['bookingCode', 'collectedFoodAmout', 'totalFoodAmount'
            ]
        }
        const selector = Object.assign({}, selection);
        await db.BookingHotel.findAll(selector)
            .then(async result => {
                //return res.status(200).json({ data: result, status: true});
                const bookingDetails = [];
                if (result && result.length > 0) {
                    result.forEach(element => {
                        if (element?.FoodOrderPayments && element?.FoodOrderPayments?.length > 0) {
                            element?.FoodOrderPayments.forEach((foodOrder, key) => {
                                bookingDetails.push({
                                    bookingCode: element.bookingCode,
                                    orderId: foodOrder?.orderId,
                                    paymentMode: paymentMode(foodOrder?.paymentMode),
                                    paymentDate: foodOrder?.createdAt,
                                    transactionId: foodOrder?.transactionId,
                                    paymentAmount: foodOrder?.paymentAmount,
                                    totalFoodAmount: key == element?.FoodOrderPayments?.length - 1 ? element.totalFoodAmount : '',
                                    collectedFoodAmout: key == element?.FoodOrderPayments?.length - 1 ? element.collectedFoodAmout : ''
                                })
                            })
                        } else {
                            bookingDetails.push({
                                bookingCode: element.bookingCode,
                                orderId: element?.FoodOrderPayments?.orderId,
                                paymentMode: element?.FoodOrderPayments?.paymentMode == 0 ? 'Offline' : 'Online',
                                paymentDate: element?.FoodOrderPayments?.createdAt,
                                transactionId: element?.FoodOrderPayments?.transactionId,
                                paymentAmount: element?.FoodOrderPayments?.paymentAmount,
                                totalFoodAmount: element.totalFoodAmount,
                                collectedFoodAmout: element.collectedFoodAmout
                            })
                        }

                    });
                }
                //Init excel
                const workbook = new excel.Workbook();
                const worksheet = workbook.addWorksheet("Food Payment List");
                // Init Columns
                worksheet.columns = [
                    { header: "Booking ID", key: "bookingCode", width: 20 },
                    { header: "Order ID", key: "orderId", width: 20 },
                    { header: "Payment Mode", key: "paymentMode", width: 25 },
                    { header: "Payment Date", key: "paymentDate", width: 25 },
                    { header: "Transaction ID", key: "transactionId", width: 25 },
                    { header: "Payment Amount", key: "paymentAmount", width: 25 },
                    { header: "Total Food Amount", key: "totalFoodAmount", width: 20 },
                    { header: "Collected Food Amount", key: "collectedFoodAmout", width: 20 },
                ];
                // Add Array Rows
                worksheet.addRows(bookingDetails);
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "food_payment_report.xlsx"
                );
                return await workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
                //return res.status(200).json({ data: bookingDetails, status: true});
            })
            .catch((err) => {
                return res.status(200).json({ status: false, message: err.message });
            });
    },

    async downloadInventoryReport(req, res) {
        const { propertyId, fromDate, toDate, stockType } = req.query;
        const filter = await createAtDateFormat(fromDate, toDate)

        if (propertyId && propertyId > 0) {
            filter['propertyId'] = parseInt(propertyId)
        }

        if (stockType == 0 || stockType > 0) {
            filter['stockType'] = stockType
        }

        const selection = {
            include: [
                { model: db.InventoryCategories, required: false, attributes: ['name'] },
                //{ model: db.InventoryItems, required: false, attributes: ['itemName']},
                { model: db.Supliers, required: false, attributes: ['id', 'name', 'mobile'] },
                //{ model: db.PropertyMaster, required: false}
            ],
            attributes: ['itemName', 'quantity', 'unit', 'avaiableQuantity', 'stockType',
                'price', 'totalAmount', 'mfdDate', 'expDate', 'status', 'createdAt', 'remarks', 'reasonToOutStock'],
            where: [filter]
        }

        const selector = Object.assign({}, selection);
        await db.Inventory.findAll(selector).then(async result => {
            //return res.status(200).json({ data: result, status: true});
            const inventory = [];
            if (result && result.length > 0) {
                result.forEach(element => {
                    inventory.push({
                        suplierName: element?.Suplier?.name + '#' + element?.Suplier?.id,
                        suplierMobile: element?.Suplier?.mobile,
                        categoryName: element?.InventoryCategory?.name,
                        itemName: element.itemName,
                        unit: element.unit,
                        qty: element.quantity,
                        avaiableQty: element.avaiableQuantity,
                        price: element.price,
                        totalAmount: element.totalAmount,
                        mfdDate: moment(new Date(element?.mfdDate)).format('YYYY-MM-DD'),
                        expDate: moment(new Date(element?.expDate)).format('YYYY-MM-DD'),
                        date: moment(new Date(element.createdAt)).format('YYYY-MM-DD'),
                        status: element.stockType == 0 ? 'In' : 'Out',
                        remark: element.remarks,
                        reasonToOutStock: element.reasonToOutStock,
                    })
                })
            }
            //Init excel
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet("Inventory List");
            // Init Columns
            worksheet.columns = [
                { header: "Suplier Name/Id", key: "suplierName", width: 20 },
                { header: "Suplier Mobile", key: "suplierMobile", width: 20 },
                { header: "Category", key: "categoryName", width: 20 },
                { header: "Item", key: "itemName", width: 20 },
                { header: "Unit", key: "unit", width: 25 },
                { header: "Qty", key: "qty", width: 25 },
                { header: "Avaiable Quantity", key: "avaiableQty", width: 25 },
                { header: "Price", key: "price", width: 25 },
                { header: "Total Amount", key: "totalAmount", width: 25 },
                { header: "Mfd. Date", key: "mfdDate", width: 25 },
                { header: "Exp. Date", key: "expDate", width: 25 },
                { header: "Date", key: "date", width: 25 },
                { header: "Status", key: "status", width: 20 },
                { header: "Remark", key: "remark", width: 20 },
                { header: "Reason To Out Stock", key: "reasonToOutStock", width: 20 }
            ];
            // Add Array Rows
            worksheet.addRows(inventory);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "inventory_report.xlsx"
            );
            return await workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async downloadFoodOrderReport(req, res) {
        const { fromDate, toDate, propertyId } = req.query;
        const filter = await createAtDateFormat(fromDate, toDate)
        const propertyFilter = {}

        if (propertyId && propertyId > 0) {
            propertyFilter['propertyId'] = parseInt(propertyId)
        }
        const selection = {
            include: [
                { model: db.BookingHotel, required: true, attributes: ['bookingCode', 'otherPersonName'], where: [propertyFilter] },
                { model: db.User, required: false, attributes: ['name'] },
            ],
            where: [filter],
            attributes: ['id', 'roomNumber', 'otherGuestName', 'ncType', 'orderAmount', 'paymentStatus', 'orderStatus', 'createdAt']
        }
        const selector = Object.assign({}, selection);
        await db.FoodOrder.findAll(selector)
            .then(async result => {
                //return res.status(200).json({ data: result, status: true});
                const orderDetails = [];
                if (result && result.length > 0) {
                    result.forEach(element => {
                        orderDetails.push({
                            orderId: 'ORDER_' + element?.id,
                            bookingCode: element?.BookingHotel?.bookingCode,
                            orderType: element?.ncType == 0 ? 'Rrooms' : 'NC Type',
                            guest: element?.otherGuestName ?? element?.User?.name ?? element?.BookingHotel?.otherPersonName ?? '',
                            roomNumber: element?.roomNumber,
                            orderAmount: element?.orderAmount,
                            orderStatus: element?.orderStatus,
                            paymentStatus: element?.paymentStatus,
                            orderDate: element?.createdAt
                        })
                    });
                }
                //Init excel
                const workbook = new excel.Workbook();
                const worksheet = workbook.addWorksheet("Food Order List");
                // Init Columns
                worksheet.columns = [
                    { header: "Order ID", key: "orderId", width: 20 },
                    { header: "Booking ID", key: "bookingCode", width: 20 },
                    { header: "Order Type", key: "orderType", width: 25 },
                    { header: "Guest", key: "guest", width: 25 },
                    { header: "Room No.", key: "roomNumber", width: 25 },
                    { header: "Amount", key: "orderAmount", width: 25 },
                    { header: "Order Status", key: "orderStatus", width: 20 },
                    { header: "Payment Status", key: "paymentStatus", width: 20 },
                    { header: "Order Date", key: "orderDate", width: 20 },
                ];
                // Add Array Rows
                worksheet.addRows(orderDetails);
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "food_order_reports.xlsx"
                );
                return await workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
                //return res.status(200).json({ data: orderDetails, status: true});
            })
            .catch((err) => {
                return res.status(200).json({ status: false, message: err.message });
            });
    },

    async downloadLoundaryReport(req, res) {
        const { fromDate, toDate, propertyId } = req.query;
        const filter = await createAtDateFormat(fromDate, toDate)
        const propertyFilter = {}

        if (propertyId && propertyId > 0) {
            propertyFilter['propertyId'] = parseInt(propertyId)
        }
        const selection = {
            include: [
                { model: db.LaundaryService, required: true, attributes: ['name', 'price'], where: [propertyFilter] },
                { model: db.LaundaryProvider, required: true, attributes: ['name', 'email', 'phone'] }
            ],
            where: [filter],
            attributes: ['orderId', 'totalServiceAmount', 'status', 'remark', 'createdAt']
        }
        const selector = Object.assign({}, selection);
        await db.LaundaryRequest.findAll(selector)
            .then(async result => {
                //return res.status(200).json({ data: result, status: true});
                const loundaryDetails = [];
                if (result && result.length > 0) {
                    result.forEach(element => {
                        loundaryDetails.push({
                            serviceProviderName: element?.LaundaryProvider?.name,
                            orderId: 'ORDER_ID_' + element?.orderId,
                            createdAt: element?.createdAt,
                            remarks: element?.remark,
                            status: element?.status,
                            totalAmount: element?.totalServiceAmount
                        })
                    });
                }
                //Init excel
                const workbook = new excel.Workbook();
                const worksheet = workbook.addWorksheet("Loundary Report");
                // Init Columns
                worksheet.columns = [
                    { header: "Service Provider Name", key: "serviceProviderName", width: 20 },
                    { header: "Order ID", key: "orderId", width: 20 },
                    { header: "Date", key: "createdAt", width: 25 },
                    { header: "Remarks", key: "remarks", width: 25 },
                    { header: "Status", key: "status", width: 25 },
                    { header: "Total Amount", key: "totalAmount", width: 25 }
                ];
                // Add Array Rows
                worksheet.addRows(loundaryDetails);
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "loundary_report.xlsx"
                );
                return await workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
                //return res.status(200).json({ data: loundaryDetails, status: true});
            })
            .catch((err) => {
                return res.status(200).json({ status: false, message: err.message });
            });
    },

    async downloadCustomerReport(req, res) {
        const { fromDate, toDate } = req.query;
        const filter = await createAtDateFormat(fromDate, toDate)

        const selection = {
            where: [filter],
            attributes: ['name', 'email', 'mobile', 'referralCode', 'gst', 'company', 'address', 'useReferralCode', 'platform']
        }
        const selector = Object.assign({}, selection);
        await db.User.findAll(selector)
            .then(async result => {
                //return res.status(200).json({ data: result, status: true});
                const customerDetails = [];
                if (result && result.length > 0) {
                    result.forEach(element => {
                        customerDetails.push({
                            name: element?.name,
                            email: element?.email,
                            mobile: element?.mobile,
                            referralCode: element?.referralCode ?? '',
                            gst: element?.gst ?? '',
                            company: element?.company ?? '',
                            address: element?.address ?? '',
                            useReferralCode: element?.useReferralCode ?? '',
                            platForm: element?.platform == 2 ? 'Mobile' : 'Web'
                        })
                    });
                }
                //Init excel
                const workbook = new excel.Workbook();
                const worksheet = workbook.addWorksheet("Customer Report");
                // Init Columns
                worksheet.columns = [
                    { header: "Name", key: "name", width: 20 },
                    { header: "Email", key: "email", width: 20 },
                    { header: "mobile", key: "mobile", width: 25 },
                    { header: "referralCode", key: "referralCode", width: 25 },
                    { header: "gst", key: "gst", width: 25 },
                    { header: "company", key: "company", width: 25 },
                    { header: "address", key: "address", width: 25 },
                    { header: "useReferralCode", key: "useReferralCode", width: 25 },
                    { header: "platForm", key: "platForm", width: 25 }
                ];
                // Add Array Rows
                worksheet.addRows(customerDetails);
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "customer_report.xlsx"
                );
                return await workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
                //return res.status(200).json({ data: customerDetails, status: true});
            })
            .catch((err) => {
                return res.status(200).json({ status: false, message: err.message });
            });
    },

    async downloadBookingReportByUser(req, res) {
        const { fromDate, toDate, bookingStatus, propertyId } = req.query;
        const filter = {}
        if (fromDate && toDate) {
            filter['fromDate'] = {
                [Op.between]: [moment(new Date(fromDate)).format('YYYY-MM-DD'), moment(new Date(toDate)).format('YYYY-MM-DD')]
            }
        } else if (fromDate) {
            filter['fromDate'] = {
                [Op.gte]: moment(new Date(fromDate)).format('YYYY-MM-DD')
            }
        } else if (toDate) {
            filter['fromDate'] = {
                [Op.lte]: moment(new Date(toDate)).format('YYYY-MM-DD')
            }
        }

        if (propertyId && propertyId > 0) {
            filter['propertyId'] = parseInt(propertyId)
        }

        if (bookingStatus) {
            filter['bookingStatus'] = parseInt(bookingStatus)
        } else {
            filter['bookingStatus'] = { [Op.not]: 0 }
        }

        const selection = {
            include: [
                /*{ model: db.PropertyMaster, required: false, attributes: ['name', 'propertyCode'],
                    include: [
                        { model: db.Rooms, required: false, attributes: ['propertyId', 'categoryId', 'breakFastPrice']},
                    ]
                },
                { model: db.RroomCategory, required: false, attributes: ['name']},*/
                { model: db.User, required: false, attributes: ['name', 'email', 'mobile'] }
            ],
            where: [filter],
            attributes: ['userId', [sequelize.fn('count', sequelize.col('userId')), 'totalBooking'], [sequelize.fn('sum', sequelize.col('collectedPayment')), 'totalCollectedAmount']],
            group: ['userId'],
        }
        const selector = Object.assign({}, selection);
        await db.BookingHotel.findAll(selector)
            .then(async result => {
                //return res.status(200).json({ data: result, status: true});
                const data = JSON.parse(JSON.stringify(result))
                const bookingDetails = [];
                if (data && data.length > 0) {
                    data.forEach(element => {
                        console.log('element----------', element);
                        bookingDetails.push({
                            customerName: element?.User?.name ?? '',
                            customerEmail: element?.User?.email ?? '',
                            customerMobile: element?.User?.mobile ?? '',
                            totalBooking: element?.totalBooking ?? '',
                            totalCollectedAmount: element?.totalCollectedAmount ?? ''
                        })
                    });
                }
                //console.log('sssssssssssss', bookingDetails);
                //Init excel
                const workbook = new excel.Workbook();
                const worksheet = workbook.addWorksheet("Booking Count By User Wise");
                // Init Columns
                worksheet.columns = [
                    { header: "Customer Name", key: "customerName", width: 25 },
                    { header: "Email", key: "customerEmail", width: 25 },
                    { header: "Mobile", key: "customerMobile", width: 25 },
                    { header: "Total Booking", key: "totalBooking", width: 20 },
                    { header: "Total Booking Amount", key: "totalCollectedAmount", width: 20 }
                ];
                // Add Array Rows
                worksheet.addRows(bookingDetails);
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "booking_report.xlsx"
                );
                return await workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
                //return res.status(200).json({ data: bookingDetails, status: true});
            })
            .catch((err) => {
                return res.status(200).json({ status: false, message: err.message });
            });
    },

    async downloadFoodOrderPaymentReport(req, res) {
        const { fromDate, toDate, propertyId, ncType } = req.query;
        if (!(propertyId && propertyId > 0 && ncType)) {
            return res.status(400).json({ status: false, message: 'Property id & NcType is required' });
        }
        const filter = await createAtDateFormat(fromDate, toDate)

        // if (ncType) {
        //     filter['ncType'] = parseInt(ncType)
        // }

        if (propertyId && propertyId > 0) {
            filter['propertyId'] = parseInt(propertyId)
        }

        if (fromDate && toDate) {
            filter['fromDate'] = {
                [Op.between]: [moment(new Date(fromDate)).format('YYYY-MM-DD'), moment(new Date(toDate)).format('YYYY-MM-DD')]
            }
        } else if (fromDate) {
            filter['fromDate'] = {
                [Op.gte]: moment(new Date(fromDate)).format('YYYY-MM-DD')
            }
        } else if (toDate) {
            filter['fromDate'] = {
                [Op.lte]: moment(new Date(toDate)).format('YYYY-MM-DD')
            }
        }

        // if(bookingStatus){
        //     filter['bookingStatus'] =  parseInt(bookingStatus)
        // }else{
        //     filter['bookingStatus'] = {[Op.not]: 0}
        // }

        const bookingIds = await db.BookingHotel.findAll({ where: [filter], attributes: ['id'] }).map(u => u.get("id"));
        if (bookingIds && bookingIds.length > 0) {
            db.FoodOrder.findAll({
                where: [{ bookingId: bookingIds }, { ncType: ncType }, { orderStatus: [0, 1, 2, 3, 4] }],
                attributes: ['ncType', 'orderStatus', [sequelize.fn('count', sequelize.col('id')), 'totalOrder'], [sequelize.fn('sum', sequelize.col('orderAmount')), 'totalOrderAmount']],
                group: ['orderStatus']
            }).then(result => {
                const response = JSON.parse(JSON.stringify(result))
                let data = {}
                console.log("response - ", response);
                if (response && response.length > 0) {
                    data = {
                        kot: ncType == 0 ? 'RRoom Search' : ncType == 1 ? 'NC' : ncType == 2 ? 'Direct' : ncType == 3 ? 'Table' : 'Other',
                        inKot: response?.filter((obj) => obj?.orderStatus === 0)?.reduce((total, booking) => {
                            return booking?.totalOrder
                        }, 0),
                        inKotAmount: response?.filter((obj) => obj?.orderStatus === 0)?.reduce((total, booking) => {
                            return booking?.totalOrderAmount
                        }, 0),
                        inProcess: response?.filter((obj) => obj?.orderStatus === 1)?.reduce((total, booking) => {
                            return booking?.totalOrder
                        }, 0),
                        inProcessAmount: response?.filter((obj) => obj?.orderStatus === 1)?.reduce((total, booking) => {
                            return booking?.totalOrderAmount
                        }, 0),
                        delivered: response?.filter((obj) => obj?.orderStatus === 2)?.reduce((total, booking) => {
                            return booking?.totalOrder
                        }, 0),
                        deliveredAmount: response?.filter((obj) => obj?.orderStatus === 2)?.reduce((total, booking) => {
                            return booking?.totalOrderAmount
                        }, 0),
                        completed: response?.filter((obj) => obj?.orderStatus === 3)?.reduce((total, booking) => {
                            return booking?.totalOrder
                        }, 0),
                        completedAmount: response?.filter((obj) => obj?.orderStatus === 3)?.reduce((total, booking) => {
                            return booking?.totalOrderAmount
                        }, 0),
                        cancelled: response?.filter((obj) => obj?.orderStatus === 4)?.reduce((total, booking) => {
                            return booking?.totalOrder
                        }, 0),
                        cancelledAmount: response?.filter((obj) => obj?.orderStatus === 4)?.reduce((total, booking) => {
                            return booking?.totalOrderAmount
                        }, 0),
                        totalOrder: response?.reduce((total, foodOrder) => {
                            return total = total + foodOrder.totalOrder
                        }, 0),
                        totalOrderAmount: response?.reduce((total, foodOrder) => {
                            return total = total + foodOrder.totalOrderAmount
                        }, 0),
                    }
                    return res.status(200).json({ status: true, data: data, message: 'Food order payment details' });
                } else {
                    const emptyData = {
                        "kot": "",
                        "inKot": 0,
                        "inKotAmount": 0,
                        "inProcess": 0,
                        "inProcessAmount": 0,
                        "delivered": 0,
                        "deliveredAmount": 0,
                        "completed": 0,
                        "completedAmount": 0,
                        "cancelled": 0,
                        "cancelledAmount": 0,
                        "totalOrder": 0,
                        "totalOrderAmount": 0
                    }
                    return res.status(200).json({ status: true, data: emptyData, message: 'Food order payment details' });
                }
            }).catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            });
        } else {
            const emptyData = {
                "kot": "",
                "inKot": 0,
                "inKotAmount": 0,
                "inProcess": 0,
                "inProcessAmount": 0,
                "delivered": 0,
                "deliveredAmount": 0,
                "completed": 0,
                "completedAmount": 0,
                "cancelled": 0,
                "cancelledAmount": 0,
                "totalOrder": 0,
                "totalOrderAmount": 0
            };
            return res.status(200).json({ status: true, data: emptyData, message: 'Food order payment details' });
        }
    },

    async downloadTransactionReport(req, res) {
        const { fromDate, toDate } = req.query;
        const filter = await createAtDateFormat(fromDate, toDate)

        const selection = {
            include: [
                {
                    model: db.BookingHotel, required: false, attributes: ['id', 'bookingCode', 'fromDate', 'toDate', 'bookingAmout', 'guestDetails', 'otherPersonName'],
                    include: [{ model: db.PropertyMaster, required: false, attributes: ['name', 'propertyCode'] },
                    { model: db.User, required: false, attributes: ['name', 'email'] }]
                }
            ],
            where: [filter],
            attributes: ['id', 'merchantTransactionId', 'merchantUserId', 'amount', 'response', 'createdAt'],
        }
        const selector = Object.assign({}, selection);

        db.Transaction.findAll(selection).then(async result => {
            //return res.status(200).json({ status: true, data: result, message: 'Transcation details fetched'});
            const data = JSON.parse(JSON.stringify(result))
            const transcationDetails = [];
            if (data && data.length > 0) {
                data.forEach(element => {
                    transcationDetails.push({
                        bookingId: element?.BookingHotel?.id ?? '',
                        bookingCode: element?.BookingHotel?.bookingCode ?? '',
                        propertyName: element?.BookingHotel?.PropertyMaster?.name ?? '',
                        propertyCode: element?.BookingHotel?.PropertyMaster?.propertyCode ?? '',
                        fromDate: element?.BookingHotel?.fromDate ?? '',
                        toDate: element?.BookingHotel?.toDate ?? '',
                        bookingAmount: element?.BookingHotel?.bookingAmout ?? '',
                        amount: element?.amount ?? '',
                        merchantTransactionId: element?.merchantTransactionId ?? '',
                        merchantUserId: element?.merchantUserId ?? '',
                        guestDetails: element?.BookingHotel?.User?.name && element?.BookingHotel?.User?.email ? element?.BookingHotel?.User?.name + '(' + element?.BookingHotel?.User?.email + ')' : '',
                        response: element?.response ?? '',
                        createdAt: element?.createdAt ?? '',
                    })
                });
            }
            //Init excel
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet("Transaction Report");
            // Init Columns
            worksheet.columns = [
                { header: "Booking Id", key: "bookingId", width: 10 },
                { header: "Booking Code ", key: "bookingCode", width: 25 },
                { header: "Property Name", key: "propertyName", width: 25 },
                { header: "Property Code ", key: "propertyCode", width: 20 },
                { header: "From Date", key: "fromDate", width: 25 },
                { header: "To Date", key: "toDate", width: 20 },
                { header: "Booking Amount", key: "bookingAmount", width: 20 },
                { header: "Amount", key: "amount", width: 20 },
                { header: "Merchant Transaction Id", key: "merchantTransactionId", width: 30 },
                { header: "Merchant User Id", key: "merchantUserId", width: 20 },
                { header: "Guest Details ", key: "guestDetails", width: 40 },
                { header: "Response", key: "response", width: 50 },
                { header: "Created At", key: "createdAt", width: 20 }
            ];
            // Add Array Rows
            worksheet.addRows(transcationDetails);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "transaction_report.xlsx"
            );
            return await workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        }).catch(err => {
            return res.status(400).json({ status: true, data: '', message: err.message });
        })
    },

    async downloadRatingReport(req, res) {
        let { fromDate, toDate, propertyId } = req.query;
        const filter = await createAtDateFormat(fromDate, toDate)
        if (propertyId) {
            filter['propertyId'] = propertyId
        }
        const selection = {
            include: [
                {
                    model: db.PropertyMaster, required: false, attributes: ['name']
                }
            ],
            where: [filter],
            attributes: ['bookingCode', 'fromDate', 'toDate', 'rating', 'review', 'createdAt'],
            oreder: [['createdAt', 'DESC'],]
        }
        const selector = Object.assign({}, selection);

        db.Rating.findAll(selection).then(async result => {
            //return res.status(200).json({ status: true, data: result, message: 'Transcation details fetched'});
            const data = JSON.parse(JSON.stringify(result))
            const transcationDetails = [];
            if (data && data.length > 0) {
                data.forEach(element => {
                    transcationDetails.push({
                        hotelName: element?.PropertyMaster?.name ?? '',
                        bookingCode: element?.bookingCode ?? '',
                        fromDate: element?.fromDate ?? '',
                        toDate: element?.toDate ?? '',
                        rating: element?.rating ?? '',
                        review: element?.review ?? '',
                    })
                });
            }
            //Init excel
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet("Rating Report");
            // Init Columns
            worksheet.columns = [
                { header: "Hotel Name", key: "hotelName", width: 35 },
                { header: "Booking Code ", key: "bookingCode", width: 25 },
                { header: "From Date", key: "fromDate", width: 25 },
                { header: "To Date ", key: "toDate", width: 20 },
                { header: "Rating", key: "rating", width: 25 },
                { header: "Review", key: "review", width: 20 }
            ];
            // Add Array Rows
            worksheet.addRows(transcationDetails);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "rating_report.xlsx"
            );
            return await workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        }).catch(err => {
            return res.status(400).json({ status: false, data: '', message: err.message });
        })
    },

    async getProperty(req, res) {
        db.PropertyMaster.findAll({ attributes: ['id', 'name', 'propertyCode'] }).then(async result => {
            return res.status(200).json({ status: true, data: result, message: 'Property list fetched' })
        }).catch(err => {
            return res.status(400).json({ status: false, data: '', message: err.message });
        })
    }

};
