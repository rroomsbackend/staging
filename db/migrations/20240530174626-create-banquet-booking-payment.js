'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('banquetBookingPayment', {
      banquatBookingPaymentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PropertyMasters',
          key: 'id'
        }
      },
      banquetBookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'banquetBooking',
          key: 'banquetBookingId'
        }
      },
      paidAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      paymentSource: {
        type: Sequelize.STRING,
        allowNull: false
      },
      referenceNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('banquetBookingPayment');
  }
};