'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FoodOrderPayments', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			orderId: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
            propertyId: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
            paymentAmount: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            paymentMode: {
                allowNull: true,
                type: Sequelize.STRING
            },
			createdAt: {
				allowNull: true,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: true,
				type: Sequelize.DATE
			},
			deletedAt: {
				type: Sequelize.DATE
			},
		});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FoodOrderPayments');
  }
};
