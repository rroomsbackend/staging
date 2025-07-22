export default (sequelize, DataTypes) => {
    const KitchenLogs = sequelize.define('KitchenLogs', {
        bookingCode: {
            type: DataTypes.STRING,
        },
        action: { type: DataTypes.STRING, allowNull: true },
        actionBy: { type: DataTypes.STRING, allowNull: true },
        operation: { type: DataTypes.STRING, allowNull: true },
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: false,
    });
    KitchenLogs.associate = function (models) {
    };
    return KitchenLogs;
};