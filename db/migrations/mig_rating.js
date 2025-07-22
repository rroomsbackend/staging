'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Rating', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},			
			userId: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				field: 'userId'
			},
			propertyId: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				defaultValue: 0,
			},
			rating: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			review: {
				type: Sequelize.STRING,
				allowNull: false,
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
		return queryInterface.dropTable('Rating');
	}
};
