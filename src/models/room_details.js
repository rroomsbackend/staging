export default (sequelize, DataTypes) => {
    const RoomDetails = sequelize.define('RoomDetails', {
        roomId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'Rooms',
                key: 'roomId'
            },
            field: 'roomId'
        },
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        bookingId: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        categoryId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'RroomCategory',
                key: 'categoryId'
            },
            field: 'categoryId'
        },
        floorNumber: DataTypes.STRING,
        roomNumber: DataTypes.STRING,
        occupancy: DataTypes.STRING,
        adult: DataTypes.INTEGER,
        child: DataTypes.INTEGER,
        status: DataTypes.INTEGER(2),
        fromDate: DataTypes.DATE,
        toDate: DataTypes.DATE,
        tempBlocked: DataTypes.INTEGER,
        createdAt:DataTypes.DATE,
        updatedAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
        RoomDetails.associate = function (models) {
            RoomDetails.belongsTo(models.Rooms, {foreignKey: 'roomId'});
            RoomDetails.belongsTo(models.RroomCategory, {foreignKey: 'categoryId'});
        };
    return RoomDetails;
};