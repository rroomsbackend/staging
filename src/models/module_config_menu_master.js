'use strict';
export default (sequelize, DataTypes) => {
  const ModuleConfigMenuMaster = sequelize.define('ModuleConfigMenuMaster', {
    groupId: DataTypes.INTEGER,
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ModuleConfigGroupMasters',
        key: 'id'
      },
      field: 'groupId'
    },
    menuName: DataTypes.STRING,
    webRoute: {
      allowNull: false,
      type: DataTypes.STRING
    },
    appRoute: {
      allowNull: false,
      type: DataTypes.STRING
    },
    icon: {
      allowNull: true,
      type: DataTypes.STRING
    },
  }, {});
  ModuleConfigMenuMaster.associate = function(models) {
    ModuleConfigMenuMaster.belongsTo(models.ModuleConfigGroupMaster, {
      foreignKey: 'groupId',
      as: 'group'
    });
    // ModuleConfigMenuMaster.hasMany(models.PropertyModuleConfig, {
    //   foreignKey: 'menuId',
    //   as: 'configs'
    // });
  };
  return ModuleConfigMenuMaster;
};