'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Roles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},			
			roleName: {
				type: Sequelize.STRING,
				defaultValue: null
			},
        	roleCode: {
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
		return queryInterface.dropTable('Roles');
	}
};
