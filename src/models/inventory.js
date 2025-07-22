export default (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
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
        suplierId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Supliers',
                key: 'id'
            },
            field: 'suplierId'
        },
        employeeId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'PropertyUser',
                key: 'employeeId'
            },
            field: 'employeeId'
        },
        itemId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'InventoryItems',
                key: 'itemId'
            },
            field: 'itemId'
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
        itemName: {
            type: DataTypes.STRING
        },
        unit: {
            type: DataTypes.STRING
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        avaiableQuantity: {
            type: DataTypes.INTEGER
        },
        price: {
            type: DataTypes.FLOAT
        },
        totalAmount: {
            type: DataTypes.FLOAT
        },
        mfdDate: {
            type: DataTypes.DATE
        },
        expDate: {
            type: DataTypes.DATE
        },
        reasonToOutStock: {
            type: DataTypes.STRING,
            defaultValue: 0
        },
        remarks: {
            type: DataTypes.STRING,
            defaultValue: 0
        },
        stockType: {
            type: DataTypes.INTEGER(2),
            defaultValue: 0
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
    Inventory.associate = function (models) {
        Inventory.belongsTo(models.InventoryCategories, {foreignKey: 'categoryId'});
        Inventory.belongsTo(models.InventoryItems, {foreignKey: 'itemId'});
        Inventory.belongsTo(models.Supliers, {foreignKey: 'suplierId'});
        Inventory.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
        Inventory.belongsTo(models.PropertyUser, {foreignKey: 'employeeId'});
    };
    return Inventory;
};