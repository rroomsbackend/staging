'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Localities', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
            name: {
				allowNull: false,
				type: Sequelize.STRING
			},
			cityId: {
				allowNull: false,
				type: Sequelize.INTEGER(2)
			},
			stateId: {
				allowNull: true,
				type: Sequelize.INTEGER(2)
			},
			pinCode: {
				allowNull: true,
				type: Sequelize.INTEGER(8)
			},
            status: {
				allowNull: false,
				default: 0,
				type: Sequelize.INTEGER(1)
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
    return queryInterface.dropTable('Localities'); 
  }
};
