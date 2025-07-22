export default (sequelize, DataTypes) => {
    const MenuName = sequelize.define('menuName', {
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        menuName: {
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
    
    
    return MenuName;
};
