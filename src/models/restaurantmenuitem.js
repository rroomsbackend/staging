'use strict';
module.exports = (sequelize, DataTypes) => {
  const RestaurantMenuItem = sequelize.define('RestaurantMenuItem', {
    name: DataTypes.STRING,
    itemCode: DataTypes.STRING,
    gstType: DataTypes.STRING,
    gstPercent: DataTypes.INTEGER,
    taxAmount: DataTypes.INTEGER,
    inclusiveTaxAmount: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    finalPrice: DataTypes.FLOAT,
    gstAmount: DataTypes.FLOAT,
    amountBeforeTax: DataTypes.FLOAT,
    incGstPrice: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    createdAt: DataTypes.DATE
  }, 
  {
    timestamps: true,
    paranoid: true});
  RestaurantMenuItem.associate = function(models) {
    // associations can be defined here
  };
  return RestaurantMenuItem;
};