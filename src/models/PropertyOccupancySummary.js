export default (sequelize, DataTypes) => {
    const PropertyOccupancySummary = sequelize.define('PropertyOccupancySummary', {
        propertyId: DataTypes.BIGINT,
        propertyCode: DataTypes.STRING,
        propertyName: DataTypes.STRING,
        categoryId: DataTypes.INTEGER,
        categoryName: DataTypes.STRING,
        totalRooms: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        availableCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        occupiedCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dirtyCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        blockedCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        roomNumbersAvailable: DataTypes.TEXT,
        roomNumbersOccupied: DataTypes.TEXT,
        roomNumbersDirty: DataTypes.TEXT,
        roomNumbersBlocked: DataTypes.TEXT,
        reportDate: DataTypes.STRING,  // storing 'DD-MM-YYYY'
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'PropertyOccupancySummary',
        timestamps: false,  // since you're manually controlling createdAt
        paranoid: false
    });

    PropertyOccupancySummary.associate = function (models) {
        // Define associations here if needed
    };

    return PropertyOccupancySummary;
};
