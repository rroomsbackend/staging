export default (sequelize, DataTypes) => {
    const NcTypeSetting = sequelize.define('NcTypeSetting', {
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
              model: 'PropertyMaster',
              key: 'propertyId'
            },
            field: 'propertyId'
        },
        ncType: DataTypes.STRING,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    NcTypeSetting.associate = function (models) {
        NcTypeSetting.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
    };
    return NcTypeSetting;
};
