export default (sequelize, DataTypes) => {
    const InventoryInStocks = sequelize.define('InventoryOutStocks', {
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
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PropertyUsers',
                key: 'id'
            },
            field: 'employeeId'
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'InventoryItems',
                key: 'id'
            },
            field: 'itemId'
        },
        reasonToOutStock: {
            type: DataTypes.STRING
        },
        itemName: {
            type: DataTypes.STRING
        },
        unit: {
            type: DataTypes.STRING
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        price: {
            type: DataTypes.FLOAT
        },
        totalAmount: {
            type: DataTypes.FLOAT
        },
        remark: {
            type: DataTypes.STRING
        },
        mfdDate: {
            type: DataTypes.DATE
        },
        expDate: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.INTEGER(2),
            defaultValue: 0
        },
        createdBy : {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        deletedBy : {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        createdAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
    }, {
            timestamps: true,
            paranoid: true,
    });
    InventoryInStocks.associate = function (models) {
        InventoryInStocks.belongsTo(models.InventoryCategories, {foreignKey: 'categoryId'});
        InventoryInStocks.belongsTo(models.InventoryItems, {foreignKey: 'itemId'});
        InventoryInStocks.belongsTo(models.PropertyUser, {foreignKey: 'employeeId'});
        InventoryInStocks.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
    };
    return InventoryInStocks;
};