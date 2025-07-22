export default (sequelize, DataTypes) => {
    const PropertyCategory = sequelize.define('PropertyCategory', {
        name: DataTypes.STRING,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    PropertyCategory.associate = function (models) {
        PropertyCategory.hasOne(models.PropertyMaster, {foreignKey: 'propertyCategoryId'});
    };
    return PropertyCategory;
};