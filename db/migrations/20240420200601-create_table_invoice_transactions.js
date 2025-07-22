'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PropertyInvoiceTransactions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},			
			invoice_id: {
				type: Sequelize.BIGINT(20),
				allowNull: true,
				defaultValue: 0
			},
			amount: {
				type: Sequelize.FLOAT,
				allowNull: true,
				defaultValue: 0
			},
			merchantTransactionId: {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: null
			},
			merchantUserId: {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: null
			},
			request: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: null
			},
			response: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: null
			},			
			status: {
				type: Sequelize.INTEGER(2),
				defaultValue: 0
			},
			createdBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: 0
			},
			updatedBy: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: 0
			},
			deletedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: 0
			},
			createdAt: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null
			},
			updatedAt: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null
			},
			deletedAt: {
				type: Sequelize.DATE,
				defaultValue: null
			},
		});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PropertyInvoiceTransactions');
  }
};
