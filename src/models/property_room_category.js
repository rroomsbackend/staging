export default (sequelize, DataTypes) => {
    const PropertyRoomCategory = sequelize.define('PropertyRoomCategory', {
        property_id: DataTypes.INTEGER,
        property_room_category_id: DataTypes.INTEGER,
        no_of_rooms: DataTypes.INTEGER,
        status: DataTypes.INTEGER(2),
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    PropertyRoomCategory.associate = function (models) {
        PropertyRoomCategory.hasOne(models.BookingHotel, {foreignKey: 'id'});
    };
    return PropertyRoomCategory;
};