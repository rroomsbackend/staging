'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LaundaryOrders', {
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
      createdBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
			},
			updatedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
			},
			deletedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
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
    return queryInterface.dropTable('LaundaryOrders');
  }
};