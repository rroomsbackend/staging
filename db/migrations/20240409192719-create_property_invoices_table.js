'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PropertyInvoices', {
      invoice_id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
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
      totalCommission: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      totalPayableAmount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      sgstPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
      },
      cgstPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
      },
      sgstAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      cgstAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      paymentStatus: {
        type: Sequelize.ENUM('paid', 'pending', 'inreview', 'failed'),
        defaultValue: 'pending'
      },
      invoiceMonth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      paymentMode:Sequelize.INTEGER(2),
      paymentSource:Sequelize.STRING,
      paymentDate:Sequelize.DATE,
      collectedPayment:Sequelize.DECIMAL(12, 2),
      merchantTransactionId:Sequelize.STRING,
      documentUrl:Sequelize.STRING,
      totalSale:Sequelize.DECIMAL(12, 2),
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PropertyInvoices');
  }
};
