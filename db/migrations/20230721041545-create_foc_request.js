'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FOCRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
			propertyId: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
      bookingId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      status: {
				type: Sequelize.ENUM('pending', 'approved'),
				defaultValue: 'pending'
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
    return queryInterface.dropTable('FOCRequests');
  }
};