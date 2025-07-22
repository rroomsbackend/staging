export default (sequelize, DataTypes) => {
    const ExpenceCategory = sequelize.define('ExpenceCategory', {
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER(2),
            defaultValue: 0
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
        tableName: 'expencecategories'
    });
    ExpenceCategory.associate = function (models) {
        ExpenceCategory.hasMany(models.ExpenceSubCategory, { foreignKey: 'expenceCatId' });
    };
    return ExpenceCategory;
};
