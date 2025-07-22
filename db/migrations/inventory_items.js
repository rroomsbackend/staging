'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('InventoryItems', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			propertyId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'PropertyMasters',
					key: 'id'
				},
				field: 'propertyId'
			},
			categoryId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'InventoryCategories',
					key: 'id'
				},
				field: 'categoryId'
			},
			itemName: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			unit: {
				allowNull: false,
				type: Sequelize.STRING
			},
			price: {
				allowNull: false,
				type: Sequelize.STRING
			},
			quantity : {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			status: {
				type: Sequelize.ENUM('active', 'inactive'),
				defaultValue: 'active'
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
		return queryInterface.dropTable('InventoryItems');
	}
};
