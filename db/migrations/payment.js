'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Payment', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
            bookedId: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			paymentAmount: {
				allowNull: false,
				type: Sequelize.STRING
			},
			paymentMode: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			propertyId: {
				allowNull: true,
				type: Sequelize.DATE
			},
            paymentDate: {
				allowNull: true,
				type: Sequelize.DATE
			},
			transactionID: {
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
    return queryInterface.dropTable('Payment'); 
  }
};
