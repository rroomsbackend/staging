'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('banquetEnquiryLog', {
      banquetEnquiryLogId: {
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
      banquetEnquiryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'banquetEnquiry',
          key: 'banquetEnquiryId'
        }
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      followUpDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      remark: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdBy: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('banquetEnquiryLog');
  }
};