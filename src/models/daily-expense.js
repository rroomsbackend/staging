'use strict';
module.exports = (sequelize, DataTypes) => {
  const DailyExpense = sequelize.define('DailyExpense', {
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PropertyMasters',
        key: 'id'
      },
      field: 'propertyId'
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    reason: DataTypes.STRING,
    remarks: DataTypes.STRING,
    expenceType: DataTypes.STRING,
    expenceSubType: DataTypes.STRING,
    paymentSource: DataTypes.INTEGER, //0-offline, 1-online
    refNumber: DataTypes.STRING,
    dateTime: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true
  });
  DailyExpense.associate = function (models) {
    DailyExpense.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
  };
  return DailyExpense;
};