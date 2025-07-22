'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LaundaryServices', {
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
      providerId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('LaundaryServices');
  }
};