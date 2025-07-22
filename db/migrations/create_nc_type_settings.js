'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('NcTypeSettings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
            propertyId: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
            ncType: {
                allowNull: false,
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
    return queryInterface.dropTable('NcTypeSettings');
  }
};
