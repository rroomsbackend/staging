'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      propertyId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      expireAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      allowChange: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      updatedPrice: {
        allowNull: true,
        type: Sequelize.STRING
      },
      startAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      bookingFrom: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      bookingTo: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Coupons');
  }
};