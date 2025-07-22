'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TransactionLogs', 'invoiceTransactionId', {
      type: Sequelize.INTEGER,
      defaultValue:0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TransactionLogs', 'invoiceTransactionId');
  }
};
