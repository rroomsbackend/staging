'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PropertyAmenities', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			property_id: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			property_amenities_id: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			status: {
				type: Sequelize.ENUM('active', 'inactive'),
				defaultValue: 'active'
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
    return queryInterface.dropTable('PropertyAmenities');
  }
};
