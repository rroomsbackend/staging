export default (sequelize, DataTypes) => {
    const property_logs = sequelize.define('property_logs', {
        logId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.JSON
        },
	remark: {
            type: DataTypes.TEXT
        },
        actionBy: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'property_logs',
        timestamps: false  // createdAt is handled manually, no updatedAt field
    });

    property_logs.associate = function (models) {
        property_logs.belongsTo(models.PropertyMaster, {
            foreignKey: 'propertyId'
        });
    };

    return property_logs;
};
