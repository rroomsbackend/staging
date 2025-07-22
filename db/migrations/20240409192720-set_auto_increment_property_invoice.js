'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE `PropertyInvoices` AUTO_INCREMENT = 1000;');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PropertyInvoices');
  }
};
