'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BookingLogs', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
            bookingId: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			action: {
				allowNull: false,
				type: Sequelize.STRING
			},
			actionBy: {
				allowNull: true,
				type: Sequelize.STRING
			},
			userType: {
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
    return queryInterface.dropTable('BookingLogs'); 
  }
};
