'use strict';
module.exports = (sequelize, DataTypes) => {
  const RestaurantFoodOrderPayment = sequelize.define('RestaurantFoodOrderPayment', {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'RestaurantFoodOrders', 
          key: 'id'
      }
  },
    transactionId: DataTypes.STRING,
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'PropertyMasters', 
          key: 'id'
      }
  },
    paymentAmount: DataTypes.INTEGER,
    paymentMode: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    // bookingId: DataTypes.INTEGER,
  }, {});
  RestaurantFoodOrderPayment.associate = function(models) {
    RestaurantFoodOrderPayment.belongsTo(models.RestaurantFoodOrder, { foreignKey: 'orderId' });
    RestaurantFoodOrderPayment.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
  };
  return RestaurantFoodOrderPayment;
};