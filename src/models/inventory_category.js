export default (sequelize, DataTypes) => {
    const InventoryCategory = sequelize.define('InventoryCategories', {
        name: DataTypes.STRING,
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PropertyMasters',
                key: 'id'
            },
            field: 'propertyId'
        },
        createdBy:DataTypes.INTEGER,
        updatedBy:DataTypes.INTEGER,
        deletedBy:DataTypes.INTEGER,
        createdAt:DataTypes.DATE,
        updatedAt:DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
    });
    InventoryCategory.associate = function (models) {
        InventoryCategory.hasOne(models.InventoryItems, {foreignKey: 'categoryId'});
        InventoryCategory.hasOne(models.InventoryInStocks, {foreignKey: 'categoryId'});
    };
    
    return InventoryCategory;
};