export default (sequelize, DataTypes) => {
    const InventoryItems = sequelize.define('InventoryItems', {
        itemName: DataTypes.STRING,
        itemCode: DataTypes.STRING,
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PropertyMasters',
                key: 'id'
            },
            field: 'propertyId'
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'InventoryCategories',
                key: 'id'
            },
            field: 'categoryId'
        },
        unit: DataTypes.STRING,
        //gstType: DataTypes.STRING,
        //gstPercent: DataTypes.INTEGER,
        //taxAmount: DataTypes.INTEGER,
        //inclusiveTaxAmount: DataTypes.FLOAT,
        price: DataTypes.FLOAT,
        //finalPrice: DataTypes.FLOAT,
        //gstAmount: DataTypes.FLOAT,
        //amountBeforeTax: DataTypes.FLOAT,
        //incGstPrice: DataTypes.FLOAT,
        quantity: DataTypes.INTEGER,
        createdBy:DataTypes.INTEGER,
        updatedBy:DataTypes.INTEGER,
        deletedBy:DataTypes.INTEGER,
        status: DataTypes.STRING,
    }, {
            timestamps: true,
            paranoid: true,
    });
    InventoryItems.associate = function (models) {
        InventoryItems.belongsTo(models.InventoryCategories, {foreignKey: 'categoryId'});
        InventoryItems.hasOne(models.InventoryInStocks, {foreignKey: 'itemId'});
        InventoryItems.hasOne(models.InventoryOutStocks, {foreignKey: 'itemId'});
    };
    return InventoryItems;
};