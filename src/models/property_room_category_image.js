export default (sequelize, DataTypes) => {
    const PropertyRoomCategoryImage = sequelize.define('PropertyRoomCategoryImage', {
        property_room_category_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        status: DataTypes.INTEGER(2),
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    PropertyRoomCategoryImage.associate = function (models) {};
    return PropertyRoomCategoryImage;
};