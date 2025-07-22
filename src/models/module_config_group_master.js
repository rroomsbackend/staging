'use strict';
export default (sequelize, DataTypes) => {
  const ModuleConfigGroupMaster = sequelize.define('ModuleConfigGroupMaster', {
    groupName: DataTypes.STRING,
    icon: {
      allowNull: true,
      type: DataTypes.STRING
    },
  }, {});
  ModuleConfigGroupMaster.associate = function (models) {
    ModuleConfigGroupMaster.hasMany(models.ModuleConfigMenuMaster, {
      foreignKey: 'groupId',
      as: 'menues'
    });
    ModuleConfigGroupMaster.hasMany(models.PropertyModuleConfig, {
      foreignKey: 'groupId',
      as: 'configs'
    });
  };
  return ModuleConfigGroupMaster;
};