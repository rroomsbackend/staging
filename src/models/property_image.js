export default (sequelize, DataTypes) => {
    const PropertyImage = sequelize.define('PropertyImage', {
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        title: DataTypes.STRING,
        image: DataTypes.STRING,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    PropertyImage.associate = function (models) {
        PropertyImage.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
    };
    return PropertyImage;
};