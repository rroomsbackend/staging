export default (sequelize, DataTypes) => {
    const RoomAmenities = sequelize.define('RoomAmenities', {
        roomId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'Rooms',
                key: 'roomId'
            },
            field: 'roomId'
        },
        amenitiesId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'Amenities',
                key: 'amenitiesId'
            },
            field: 'amenitiesId'
        },
        status: DataTypes.INTEGER(2), 
        createdAt:DataTypes.DATE,
        updatedAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
        RoomAmenities.associate = function (models) {
            RoomAmenities.belongsTo(models.Rooms, {foreignKey: 'roomId'});
        };
    return RoomAmenities;
};