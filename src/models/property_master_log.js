export default (sequelize, DataTypes) => {
    const PropertyMasterLog = sequelize.define('PropertyMasterLog', {
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action: {
            type: DataTypes.ENUM('create', 'update'),
            allowNull: false
        },
        dataSnapshot: {
            type: DataTypes.JSON,
            allowNull: false
        },
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
        remark: DataTypes.STRING,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
        tableName: 'propertymaster_log'
    });

    return PropertyMasterLog;
};