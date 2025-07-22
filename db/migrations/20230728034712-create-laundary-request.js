'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LaundaryRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
      serviceId: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
      providerId: {
				allowNull: false,
				type: Sequelize.STRING
			},
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      inQty: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      totalServiceAmount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
				type: Sequelize.ENUM('in', 'out'),
				defaultValue: 'out'
			},
      remark: {
        allowNull: true,
        type: Sequelize.STRING
      },
      receivedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
				type: Sequelize.DATE
			},
      createdBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
			},
			updatedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
			},
			deletedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true
			},
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LaundaryRequests');
  }
};