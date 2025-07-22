export default (sequelize, DataTypes) => {
    const MenuCategory = sequelize.define('menuCategory', {
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        categoryName: {
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
    return MenuCategory;
};
