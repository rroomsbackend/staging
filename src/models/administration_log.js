export default (sequelize, DataTypes) => {
    const AdministrationLogs = sequelize.define('AdministrationLogs', {
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
    AdministrationLogs.associate = function (models) {
    };
    return AdministrationLogs;
};