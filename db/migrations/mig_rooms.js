'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Rooms', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			propertyId: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			propertyId: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			categoryId: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			minPrice: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			maxPrice: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			regularPrice: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			offerPrice: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			roomDescription: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			occupancy: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			breakFastPrice: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			ap: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			map: {
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
		return queryInterface.dropTable('Rooms');
	}
};
