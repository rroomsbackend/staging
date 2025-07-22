'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Enquiries', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			firstName: {
				type: Sequelize.STRING
			},
			lastName: {
				type: Sequelize.STRING
			},
			mobile: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING
			},
			propertyName: {
				type: Sequelize.STRING
			},
			addressLine1: {
				allowNull: true,
				type: Sequelize.STRING
			},
			addressLine2: {
				allowNull: true,
				type: Sequelize.STRING
			},
			stateId: {
				allowNull: true,
				type: Sequelize.STRING
			},
			city: {
				allowNull: true,
				type: Sequelize.STRING
			},
			pincode: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			remark: {
				allowNull: true,
				type: Sequelize.STRING
			},
			assignTo: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			status: {
				type: Sequelize.ENUM('open', 'close'),
				defaultValue: 'open'
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
		return queryInterface.dropTable('Enquiries');
	}
};
