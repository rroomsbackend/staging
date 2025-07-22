'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Customers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userCode: {
				type: Sequelize.STRING
			},
			name: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING
			},
			mobile: {
				type: Sequelize.STRING
			},
			otp: {
				type: Sequelize.INTEGER
			},
			valid: {
				type: Sequelize.INTEGER
			},
			status: {
				type: Sequelize.ENUM('active', 'inactive'),
				defaultValue: 'active'
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
		return queryInterface.dropTable('Customers');
	}
};
