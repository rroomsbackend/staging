export default (sequelize, DataTypes) => {
    const RRoomsCommission = sequelize.define('RRoomsCommission', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PropertyMasters',
                key: 'id'
            },
            field: 'propertyId'
        },
        commissionPercentage: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        lastUpdatedBy: DataTypes.STRING,
        createdAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
        deletedAt: {
            type: DataTypes.DATE
        }
    }, {
        timestamps: true,
        paranoid: true
    });
    RRoomsCommission.associate = function (models) {
        RRoomsCommission.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
    };
    return RRoomsCommission;
};