'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('PropertyUsers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},			
			propertyId: {
				allowNull: true,
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			userCode: Sequelize.STRING,
			role: {
				allowNull: true,
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			firstName: {
				allowNull: true,
				type: Sequelize.STRING,
				defaultValue: null
			},
			lastName: {
				allowNull: true,
				type: Sequelize.STRING,
				defaultValue: null
			},
			designation: {
				allowNull: true,
				type: Sequelize.STRING,
				defaultValue: null
			},
			email: {
				allowNull: true,
				type: Sequelize.STRING,
				defaultValue: null
			},
			mobile: {
				allowNull: true,
				type: Sequelize.STRING,
				defaultValue: null
			},
			password: {
				allowNull: true,
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
		return queryInterface.dropTable('PropertyUsers');
	}
};
