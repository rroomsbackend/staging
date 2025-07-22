'use strict';
export default (sequelize, DataTypes) => {
  const PropertyModuleConfig = sequelize.define('PropertyModuleConfig', {
    propertyId: DataTypes.INTEGER,
    propertyUserId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    activeMenuIds: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
  }, {});
  PropertyModuleConfig.associate = function(models) {
    PropertyModuleConfig.belongsTo(models.ModuleConfigGroupMaster, {
      foreignKey: 'groupId',
      as: 'group'
    });
    
    PropertyModuleConfig.belongsTo(models.PropertyUser, {
      foreignKey: 'propertyUserId',
      as: 'user'
    });
  };
  return PropertyModuleConfig;
};