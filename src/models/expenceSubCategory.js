export default (sequelize, DataTypes) => {
    const ExpenceSubCategory = sequelize.define('ExpenceSubCategory', {
        expenceCatId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'ExpenceCategory',
                key: 'id'
            },
            field: 'expenceCatId'
        },
        subCategoryName: {
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
        tableName: 'expencesubcategories'
    });
    ExpenceSubCategory.associate = function (models) {
        ExpenceSubCategory.belongsTo(models.ExpenceCategory, { foreignKey: 'expenceCatId' });
    };
    return ExpenceSubCategory;
};
