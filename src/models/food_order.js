export default (sequelize, DataTypes) => {
    const FoodOrder = sequelize.define('FoodOrder', {
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
        roomNumber: DataTypes.STRING,
        orderAmount: DataTypes.INTEGER,
        totalFoodAmountBeforeGST: DataTypes.INTEGER,
        discountPercentage: DataTypes.INTEGER, //
        paidAmount: DataTypes.INTEGER,
        dueAmount: DataTypes.INTEGER, //
        afterDiscount: DataTypes.INTEGER,
        paymentStatus: DataTypes.INTEGER,
        orderStatus: DataTypes.INTEGER,
        orderNote: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ncType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        otherGuestName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        orderItems: {
            type: DataTypes.INTEGER,
            set: function (value) {
                return this.setDataValue("orderItems", JSON.stringify(value));
            }
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true
        },
        waiterID: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        createdAt: DataTypes.DATE,
        acceptedBy: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        acceptedAt: DataTypes.DATE,
        deliveredBy: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        deliveredAt: DataTypes.DATE,
        rejectedBy: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        rejectedAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    FoodOrder.associate = function (models) {
        FoodOrder.belongsTo(models.User, { foreignKey: 'userId' });
        FoodOrder.belongsTo(models.BookingHotel, { foreignKey: 'bookingId' });
        FoodOrder.hasMany(models.FoodOrderPayment, { foreignKey: 'orderId' });
        FoodOrder.belongsTo(models.PropertyUser, {
            foreignKey: 'acceptedBy',
            as: 'acceptedByUser'
        });
        FoodOrder.belongsTo(models.PropertyUser, {
            foreignKey: 'deliveredBy',
            as: 'deliveredByUser'
        });
        FoodOrder.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        FoodOrder.belongsTo(models.PropertyUser, {
            foreignKey: 'createdBy',
            as: 'createdByUser'
        });
        FoodOrder.hasMany(models.FoodOrderPayment, {
            foreignKey: 'orderId',
            as: 'payments'
        });
        FoodOrder.hasMany(models.FoodOrderPayment, {
            foreignKey: 'orderId',
            as: 'paymentsByOrderId'
        });

        FoodOrder.hasMany(models.FoodOrderPayment, {
            foreignKey: 'bookingId',
            as: 'paymentsByBookingId'
        });

    };
    return FoodOrder;
};