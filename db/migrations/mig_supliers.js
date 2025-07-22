'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Supliers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},			
			name: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			propertyId: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			suplierCode: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			email: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			mobile: {
				type: Sequelize.STRING,
				defaultValue: 0
			},
			address: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			adharNumber: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			panNumber: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			gst: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			bankName: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			branchName: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			accountName: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			accountNumber: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			ifsc: {
				type: Sequelize.STRING,
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
		return queryInterface.dropTable('Supliers');
	}
};
