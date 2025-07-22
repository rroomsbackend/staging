'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('SuplierItem', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			propertyId: {
				type: Sequelize.INTEGER
			},
			categoryId: {
				type: Sequelize.INTEGER
			},
			suplierId: {
				type: Sequelize.INTEGER
			},
			itemId: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			price: {
				type: Sequelize.FLOAT
			},
			quantity: {
				type: Sequelize.INTEGER
			},
			status: {
				type: Sequelize.INTEGER(2),
				defaultValue: 0
			},
			createdBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
			},
			updatedBy: {
				type: Sequelize.INTEGER(11),
				allowNull: true
			},
			deletedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
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
		return queryInterface.dropTable('SuplierItem');
	}
};
