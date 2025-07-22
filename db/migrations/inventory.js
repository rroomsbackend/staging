'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Inventory', {
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
				type: Sequelize.INTEGER
			},
			suplierId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Supliers',
					key: 'id'
				},
				field: 'suplierId'
			},
			itemId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'InventoryItems',
					key: 'id'
				},
				field: 'itemId'
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
			avaiableQuantity: {
				type: Sequelize.INTEGER
			},
			price: {
				type: Sequelize.FLOAT
			},
			totalAmount: {
				type: Sequelize.FLOAT
			},
			remark: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			reasonToOutStock: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			mfdDate: {
				type: Sequelize.DATE
			},
			expDate: {
				type: Sequelize.DATE
			},
			stockType: {
				type: Sequelize.INTEGER(2),
				defaultValue: 0
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
		return queryInterface.dropTable('Inventory');
	}
};
