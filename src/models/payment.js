export default (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        bookedId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'BookingHotel',
                key: 'bookedId'
            },
            field: 'bookedId'
        },
        paymentAmount: DataTypes.STRING,
        paymentMode: DataTypes.STRING,
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        paymentDate: DataTypes.DATE,
        transactionID: DataTypes.STRING,
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    Payment.associate = function (models) {
        Payment.belongsTo(models.BookingHotel, { foreignKey: 'bookedId' });
        Payment.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
    };
    return Payment;
};