'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DailyExpenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      propertyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PropertyMasters',
          key: 'id'
        },
        field: 'propertyId'
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      reason: {
        type: Sequelize.STRING
      },
      remarks: {
        type: Sequelize.STRING
      },
      expenceType: {
        type: Sequelize.STRING
      },
      expenceSubType: {
        type: Sequelize.STRING
      },
      paymentSource: {
        type: Sequelize.INTEGER
      },
      refNumber: {
        type: Sequelize.STRING
      },
      dateTime: {
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
				type: Sequelize.DATE,
				defaultValue: null
			},
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DailyExpenses');
  }
};