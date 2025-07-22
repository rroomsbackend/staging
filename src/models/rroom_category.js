export default (sequelize, DataTypes) => {
    const RroomCategory = sequelize.define('RroomCategory', {
        name: DataTypes.STRING,
        maxPrice: DataTypes.STRING,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    RroomCategory.associate = function (models) {
        RroomCategory.hasOne(models.Rooms, {foreignKey: 'categoryId'});
        RroomCategory.hasOne(models.BookingHotel, {foreignKey: 'propertyRoomsCategoryId'});
        RroomCategory.hasMany(models.RoomDetails, {foreignKey: 'categoryId'});
    };
    return RroomCategory;
};