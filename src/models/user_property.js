export default (sequelize, DataTypes) => {
    const UserProperty = sequelize.define('UserProperty', {
        propertyUserId: DataTypes.INTEGER,
        propertyId: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
        deletedBy:DataTypes.INTEGER,
        createdAt: DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    UserProperty.associate = function (models) {
        UserProperty.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
        UserProperty.belongsTo(models.PropertyUser, {foreignKey: 'propertyUserId'});
    };
    return UserProperty;
};