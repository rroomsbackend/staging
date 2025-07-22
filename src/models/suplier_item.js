export default (sequelize, DataTypes) => {
    const SuplierItem = sequelize.define('SuplierItem', {
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        categoryId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0,
            references: {
                model: 'InventoryCategories',
                key: 'categoryId'
            },
            field: 'categoryId'
        },
        suplierId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0,
            references: {
                model: 'Supliers',
                key: 'suplierId'
            },
            field: 'suplierId'
        },
        itemId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0,
            references: {
                model: 'InventoryItems',
                key: 'itemId'
            },
            field: 'itemId'
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price: {
            type: DataTypes.FLOAT,
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
    SuplierItem.associate = function (models) {
        SuplierItem.belongsTo(models.InventoryCategories, {foreignKey: 'categoryId'});
        SuplierItem.belongsTo(models.InventoryItems, {foreignKey: 'itemId'});
        SuplierItem.belongsTo(models.Supliers, {foreignKey: 'suplierId'});
        SuplierItem.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
    };
    return SuplierItem;
};