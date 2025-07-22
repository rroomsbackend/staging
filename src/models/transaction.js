export default (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        bookingId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'BookingHotel',
                key: 'bookingId'
            },
            field: 'bookingId'
        },
        amount: DataTypes.FLOAT,
        status: DataTypes.STRING,
        merchantTransactionId: DataTypes.STRING,
        merchantUserId: DataTypes.STRING,
        request: {
            type: DataTypes.TEXT,
            set: function(value) {
              return this.setDataValue("request", JSON.stringify(value));
            }
        },
        response: {
            type: DataTypes.TEXT,
            set: function(value) {
              return this.setDataValue("response", JSON.stringify(value));
            }
        },
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    Transaction.associate = function (models) {
        Transaction.belongsTo(models.BookingHotel, { foreignKey: 'bookingId' });
    };
    return Transaction;
};