'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FoodOrders', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userId: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
            bookingId: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
            roomNumber: {
                allowNull: false,
                type: Sequelize.STRING
            },
            orderAmount: {
                allowNull: true,
                type: Sequelize.FLOAT
            },
            paymentStatus: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            orderStatus: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            orderNote: {
                type: Sequelize.STRING,
                allowNull: true
            },
            ncType: {
                type: Sequelize.STRING,
                allowNull: true
            },
            otherGuestName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            orderItems: {
                allowNull: true,
                type: Sequelize.TEXT
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
    return queryInterface.dropTable('FoodOrders');
  }
};
