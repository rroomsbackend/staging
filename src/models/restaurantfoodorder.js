'use strict';
module.exports = (sequelize, DataTypes) => {
  const RestaurantFoodOrder = sequelize.define('RestaurantFoodOrder', {
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'PropertyMasters', 
          key: 'id'
      }
  },
    roomNumber: DataTypes.STRING,
    orderAmount: DataTypes.INTEGER,
    paidAmount: DataTypes.INTEGER,
    paymentStatus: DataTypes.INTEGER,
    orderStatus: DataTypes.INTEGER,
    orderNote: DataTypes.STRING,
    orderType: DataTypes.STRING,
    otherGuestName: DataTypes.STRING,
    orderItems: DataTypes.JSON,
    bookingId: DataTypes.INTEGER,
    remark: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    customerMobile: DataTypes.STRING,
    customerEmail: DataTypes.STRING,
    customerGst: DataTypes.STRING,
    tableNumber: DataTypes.INTEGER,
  }, {
    timestamps: true,
    paranoid: true 
  });
  RestaurantFoodOrder.associate = function(models) {
    // associations can be defined here
    RestaurantFoodOrder.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
  };
  return RestaurantFoodOrder;
};