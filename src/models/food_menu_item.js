export default (sequelize, DataTypes) => {
    const FoodMenuItem = sequelize.define('FoodMenuItem', {
        categoryId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'FoodItemCategory',
                key: 'categoryId'
            },
            field: 'categoryId'
        },
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        name: DataTypes.STRING,
        itemCode: DataTypes.STRING,
        gstType: DataTypes.STRING,
        gstPercent: DataTypes.INTEGER,
        taxAmount: DataTypes.INTEGER,
        inclusiveTaxAmount: DataTypes.FLOAT,
        price: DataTypes.FLOAT,
        finalPrice: DataTypes.FLOAT,
        gstAmount: DataTypes.FLOAT,
        amountBeforeTax: DataTypes.FLOAT,
        incGstPrice: DataTypes.FLOAT,
        quantity: DataTypes.INTEGER,
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    FoodMenuItem.associate = function (models) {
        FoodMenuItem.belongsTo(models.FoodItemCategory, { foreignKey: 'categoryId' });
        FoodMenuItem.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
    };
    return FoodMenuItem;
};