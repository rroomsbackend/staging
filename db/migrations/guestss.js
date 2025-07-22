'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('GuestDetails', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			bookedId: Sequelize.INTEGER,
			name: Sequelize.STRING,
			age: {
				type: Sequelize.INTEGER
			},
			gender: {
				type: Sequelize.STRING
			},
			document_number: {
				allowNull: true,
				type: Sequelize.STRING
			},
        	document_type: {
				allowNull: true,
				type: Sequelize.STRING
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
		return queryInterface.dropTable('GuestDetails');
	}
};
