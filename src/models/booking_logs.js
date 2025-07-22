export default (sequelize, DataTypes) => {
    const BookingLogs = sequelize.define('BookingLogs', {
        bookingId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'BookingHotel',
                key: 'bookingId'
            },
            field: 'bookingId'
        },
        action: { type: DataTypes.STRING, allowNull: true },
        paymentMode: { type: DataTypes.STRING, allowNull: true },
        activityType: { type: DataTypes.STRING, allowNull: true },
        actionBy: { type: DataTypes.STRING, allowNull: true },
        userType: { type: DataTypes.STRING, allowNull: true },
        remark: { type: DataTypes.TEXT, allowNull: true },
        // upload krna hai
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    BookingLogs.associate = function (models) {
        BookingLogs.belongsTo(models.BookingHotel, { foreignKey: 'bookingId' });
        BookingLogs.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId', as: 'property' });
    };
    return BookingLogs;
};