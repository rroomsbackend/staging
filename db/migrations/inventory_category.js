'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('InventoryCategories', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.INTEGER(11),
				allowNull: false
			},
			propertyId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'PropertyMasters',
					key: 'id'
				},
				field: 'propertyId'
			},
      		createdBy : {
				type: Sequelize.INTEGER(11),
				allowNull: false
			},
			updatedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: false
			},
			deletedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: false
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
    return queryInterface.dropTable('InventoryCategories'); 
  }
};
