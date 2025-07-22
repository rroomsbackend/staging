export default (sequelize, DataTypes) => {
    const PropertyAmenities = sequelize.define('PropertyAmenities', {
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        propertyAmenitiesId:{
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'Amenities',
                key: 'propertyAmenitiesId'
            },
            field: 'propertyAmenitiesId'
        },
    }, {
            timestamps: true,
            paranoid: true,
        });
    PropertyAmenities.associate = function (models) {
        PropertyAmenities.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
        PropertyAmenities.belongsTo(models.Amenities, {foreignKey: 'propertyAmenitiesId'});
    };
    return PropertyAmenities;
};