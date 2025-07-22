'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('PropertyImages', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
            propertyId: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
				defaultValue: 0
            },
            title: {
				type: Sequelize.STRING,
				defaultValue: null
			},
            image: {
				type: Sequelize.STRING,
				defaultValue: null
			},
            status: {
				type: Sequelize.INTEGER(2),
				defaultValue: 0
			},
			createdBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
			},
			updatedBy: {
				type: Sequelize.INTEGER(11),
				allowNull: true
			},
			deletedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
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
        })
    },
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('PropertyImages');
	}
}