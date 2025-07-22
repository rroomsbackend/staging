'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('RoomDetails', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},			
			roomId: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				defaultValue: 0
			},
			categoryId: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				defaultValue: 0
			},
			floorNumber: {
				type: Sequelize.STRING,
				defaultValue: 0
			},
			roomNumber: {
				type: Sequelize.STRING,
				defaultValue: 0
			},
			occupancy: {
				type: Sequelize.STRING,
				defaultValue: 0
			},
			adult: {
				type: Sequelize.INTEGER(4),
				defaultValue: 0
			},
			child: {
				type: Sequelize.INTEGER(4),
				defaultValue: 0
			},			
			fromDate: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null
			},
			toDate: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null
			},
			tempBlocked: {
				type: Sequelize.INTEGER(1),
				defaultValue: 0
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
		return queryInterface.dropTable('RoomDetails');
	}
};
