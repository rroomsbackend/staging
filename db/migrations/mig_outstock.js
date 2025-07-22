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
				type: Sequelize.INTEGER(11),
				allowNull: false,
				references: {
					model: 'PropertyUsers',
					key: 'id'
				},
				field: 'employeeId'
			},
			itemId: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			reasonToOutStock: {
				type: Sequelize.STRING
			},
			itemName: {
				type: Sequelize.STRING
			},
			unit: {
				type: Sequelize.STRING
			},
			quantity: {
				type: Sequelize.INTEGER
			},
			price: {
				type: Sequelize.FLOAT
			},
			totalAmount: {
				type: Sequelize.FLOAT
			},
			remark: {
				type: Sequelize.STRING
			},
			mfdDate: {
				type: Sequelize.DATE
			},
			expDate: {
				type: Sequelize.DATE
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
		return queryInterface.dropTable('InventoryOutStocks');
	}
};
