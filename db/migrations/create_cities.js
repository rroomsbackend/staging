'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Cities', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			state_id: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			state_code: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			country_id: {
				allowNull: true,
				type: Sequelize.STRING,
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
    return queryInterface.dropTable('Cities');
  }
};
