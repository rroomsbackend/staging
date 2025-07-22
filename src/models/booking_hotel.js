////////////////////////////////////////// STAGING ///////////////////////////////////


export default (sequelize, DataTypes) => {
    const BookingHotel = sequelize.define('BookingHotel', {
        bookingCode: DataTypes.STRING,
        userId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'User',
                key: 'userId'
            },
            field: 'userId'
        },
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        propertyRoomsCategoryId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'PropertyRoomCategory',
                key: 'propertyRoomsCategoryId'
            },
            field: 'propertyRoomsCategoryId'
        },
        fromDate: DataTypes.DATE,
        toDate: DataTypes.DATE,
        noOfRooms: DataTypes.INTEGER(2),
        adults: DataTypes.INTEGER(3),
        children: DataTypes.INTEGER(3),
        paymentMode: DataTypes.INTEGER(2),
        PaymentStatus: DataTypes.INTEGER(2),
        bookingStatus: DataTypes.INTEGER(2),
        bookingAmout: DataTypes.FLOAT,
        bookForOther: DataTypes.INTEGER(2),
        otherPersonName: DataTypes.STRING,
        otherPersonNumber: DataTypes.STRING,
        source: DataTypes.STRING,
        assignRoomNo: DataTypes.STRING,
        assignRoomDetailsId: DataTypes.STRING,
        reason: DataTypes.STRING,
        collectedPayment: DataTypes.FLOAT,
        dueAmount: DataTypes.FLOAT,
        partialPayAmount: DataTypes.INTEGER, // 08-07-2025
        fullPayAmount: DataTypes.INTEGER, // 08-07-2025
        payAtHotelAmount: DataTypes.INTEGER, // 08-07-2025
        otaBookingId: DataTypes.STRING,
        referenceName: DataTypes.STRING,
        checkInDateTime: DataTypes.DATE,
        checkOutDateTime: DataTypes.DATE,
        breakFast: DataTypes.TINYINT(2),
        extraCharge1: DataTypes.STRING,
        extraCharge2: DataTypes.STRING,
        extraCharge3: DataTypes.STRING,
        extraCharge4: DataTypes.STRING,
        extraCharge5: DataTypes.STRING,
        room1: DataTypes.STRING,
        room2: DataTypes.STRING,
        room3: DataTypes.STRING,
        room4: DataTypes.STRING,
        room5: DataTypes.STRING,
        remark: DataTypes.STRING,
        shiftedTo: DataTypes.INTEGER(11),
        cidAmount: DataTypes.INTEGER(11),
        bookingTransfered: DataTypes.INTEGER(11),
        reasonForShifting: {
            type: DataTypes.ENUM('Check-In denied', 'Property sold out', ' Customer issue'),
            allowNull: true
        }, //
        localOutstation: {
            type: DataTypes.ENUM('Local', 'Outstation'),
            allowNull: true
        },
        bookingHours: DataTypes.FLOAT,
        totalFoodAmount: DataTypes.FLOAT,
        totalFoodAmountBeforeGST: DataTypes.INTEGER,
        foodDiscountPercentage: DataTypes.INTEGER, //
        totalFoodDiscountAmount: DataTypes.INTEGER, //
        discountOnFood: DataTypes.INTEGER,
        dueFoodAmount: DataTypes.INTEGER, //        
        collectedFoodAmout: DataTypes.FLOAT,
        useWalletAmount: DataTypes.FLOAT,
        cuponCode: DataTypes.STRING,
        discountAmount: DataTypes.FLOAT,
        platform: DataTypes.TINYINT(2),
        cancelledBy: DataTypes.STRING,
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    BookingHotel.associate = function (models) {
        BookingHotel.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
        BookingHotel.belongsTo(models.RroomCategory, { foreignKey: 'propertyRoomsCategoryId' });
        BookingHotel.belongsTo(models.User, {
            foreignKey: 'userId'
            // ,as: 'user'
        });
        BookingHotel.hasMany(models.GuestDetails, { foreignKey: 'bookedId' });
        BookingHotel.hasMany(models.Payment, { foreignKey: 'bookedId' });
        BookingHotel.hasMany(models.FoodOrderPayment, { foreignKey: 'bookingId' });
        BookingHotel.hasMany(models.FoodOrder, { foreignKey: 'bookingId' });
        BookingHotel.hasOne(models.BookingLogs, { foreignKey: 'bookingId' });
        BookingHotel.hasMany(models.Transaction, { foreignKey: 'bookingId' });
    };
    return BookingHotel;
};