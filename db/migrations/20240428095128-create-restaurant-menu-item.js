'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RestaurantMenuItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      itemCode: {
        type: Sequelize.STRING
      },
      gstType: {
        type: Sequelize.STRING
      },
      gstPercent: {
        type: Sequelize.INTEGER
      },
      taxAmount: {
        type: Sequelize.INTEGER
      },
      inclusiveTaxAmount: {
        type: Sequelize.FLOAT
      },
      price: {
        type: Sequelize.FLOAT
      },
      finalPrice: {
        type: Sequelize.FLOAT
      },
      gstAmount: {
        type: Sequelize.FLOAT
      },
      amountBeforeTax: {
        type: Sequelize.FLOAT
      },
      incGstPrice: {
        type: Sequelize.FLOAT
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RestaurantMenuItems');
  }
};