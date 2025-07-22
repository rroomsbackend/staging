export default (sequelize, DataTypes) => {
    const FoodItemCategory = sequelize.define('FoodItemCategory', {
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    FoodItemCategory.associate = function (models) { };
    return FoodItemCategory;
};