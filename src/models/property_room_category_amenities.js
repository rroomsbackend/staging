export default (sequelize, DataTypes) => {
    const PropertyRoomCategoryAmenities = sequelize.define('PropertyRoomCategoryAmenities', {
        property_room_category_id: DataTypes.INTEGER,
        amenities_id: DataTypes.INTEGER,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    PropertyRoomCategoryAmenities.associate = function (models) {};
    return PropertyRoomCategoryAmenities;
};