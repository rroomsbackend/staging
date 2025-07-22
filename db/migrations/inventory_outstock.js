'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('InventoryOutStocks', {
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
			employeeId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'PropertyUsers',
					key: 'id'
				},
				field: 'employeeId'
			},
			itemId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'InventoryItems',
					key: 'id'
				},
				field: 'itemId'
			},
			reasonToOutStock: {
				allowNull: true,
				type: Sequelize.STRING
			},
			itemName: {
				type: Sequelize.STRING
			},
			unit: {
				type: Sequelize.STRING
			},
      		quantity: {
				type: Sequelize.STRING
			},
			price: {
				type: Sequelize.STRING
			},
			totalAmount: {
				type: Sequelize.STRING
			},
			remark: {
				allowNull: true,
				type: Sequelize.STRING
			},
			password: {
				allowNull: true,
				type: Sequelize.STRING
			},
			mfdDate: {
				type: Sequelize.STRING
			},
			expDate: {
				type: Sequelize.STRING
			},
			status: {
				type: Sequelize.ENUM('InStock', 'OutStock'),
				defaultValue: 'InStock'
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
		return queryInterface.dropTable('InventoryOutStocks');
	}
};
