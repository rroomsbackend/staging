'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('InvoiceSiteSettings', {
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
            logo: {
                allowNull: false,
                type: Sequelize.STRING
            },
            name: {
                allowNull: true,
                type: Sequelize.STRING
            },
            email: {
                allowNull: true,
                type: Sequelize.STRING
            },
            phone: {
                allowNull: true,
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            gstNumber: {
                type: Sequelize.STRING,
                allowNull: true
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            queryContactNumber: {
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
    return queryInterface.dropTable('InvoiceSiteSettings');
  }
};
