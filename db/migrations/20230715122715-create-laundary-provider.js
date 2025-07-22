'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LaundaryProviders', {
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
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      providerCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      alternateMobile: {
        type: Sequelize.STRING,
        allowNull: true
      },
      panNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gst: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      branchName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accountName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ifsc: {
        type: Sequelize.STRING,
        allowNull: false
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
    return queryInterface.dropTable('LaundaryProviders');
  }
};