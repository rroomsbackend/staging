export default (sequelize, DataTypes) => {
    const Amenities = sequelize.define('Amenities', {
        name: DataTypes.STRING,
        icon: DataTypes.STRING,
        micon: DataTypes.STRING,
        createdAt:DataTypes.DATE,
        status: {
            type: DataTypes.INTEGER(2),
            defaultValue: 0
        },
type: {
            type: DataTypes.ENUM('hotel', 'room'),
            defaultValue: 'hotel'
        }
    }, {
            timestamps: true,
            paranoid: true,
        });
    Amenities.associate = function (models) {
        Amenities.hasMany(models.PropertyAmenities, {foreignKey: 'propertyAmenitiesId'});
    };
    return Amenities;
};