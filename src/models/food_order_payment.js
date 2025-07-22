export default (sequelize, DataTypes) => {
    const FoodOrderPayment = sequelize.define('FoodOrderPayment', {
        orderId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'FoodOrder',
                key: 'orderId'
            },
            field: 'orderId'
        },
        bookingId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'BookingHotel',
                key: 'bookingId'
            },
            field: 'bookingId'
        },
        transactionId: DataTypes.STRING,
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        paymentAmount: DataTypes.INTEGER,
        orderAmount: DataTypes.INTEGER,
        totalDiscountAmount: DataTypes.INTEGER,
        paymentMode: DataTypes.STRING,
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    FoodOrderPayment.associate = function (models) {
        FoodOrderPayment.belongsTo(models.FoodOrder, { foreignKey: 'orderId' });
        FoodOrderPayment.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
        FoodOrderPayment.belongsTo(models.BookingHotel, { foreignKey: 'bookingId' });
        FoodOrderPayment.belongsTo(models.FoodOrder, {
            foreignKey: 'orderId',
            as: 'orderByOrderId'
        });

        FoodOrderPayment.belongsTo(models.FoodOrder, {
            foreignKey: 'bookingId',
            as: 'orderByBookingId'
        });

    };
    return FoodOrderPayment;
};