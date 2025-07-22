'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('UserProperty', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
            propertyUserId: {
				allowNull: true,
				type: Sequelize.INTEGER,
				defaultValue: 0
			},		
			propertyId: {
				allowNull: true,
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			status: {
				type: Sequelize.INTEGER(2),
				defaultValue: 1
			},
			createdBy : {
				type: Sequelize.INTEGER(11),
				allowNull: false,
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
		return queryInterface.dropTable('UserProperty');
	}
};
