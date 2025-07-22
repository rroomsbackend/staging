export default (sequelize, DataTypes) => {
    const MenuItem = sequelize.define('menuItem', {
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        menuNameId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'menuNames', 
                key: 'id'
            }
        },
        menuCategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'menuCategories', 
                key: 'id'
            }
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: true,
    });
    
    MenuItem.associate = function (models) {
        MenuItem.belongsTo(models.menuName, { foreignKey: 'menuNameId' });
        // BanquetBooking.belongsTo(models.BanquetEnquiry, {foreignKey: 'banquetEnquiryId'})
        MenuItem.belongsTo(models.menuCategory, { foreignKey: 'menuCategoryId' });
    };
    return MenuItem;
};
