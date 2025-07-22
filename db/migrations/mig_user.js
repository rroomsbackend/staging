'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Users', {
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
			email: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			password: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			mobile: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			otp: {
				type: Sequelize.INTEGER(6),
				defaultValue: 0
			},
			referralCode: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			profileImage: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			lastLogged: {
				allowNull: true,
				type: Sequelize.DATE,
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
		return queryInterface.dropTable('Users');
	}
};
