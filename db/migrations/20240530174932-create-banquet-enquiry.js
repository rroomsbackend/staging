'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('banquetEnquiry', {
      banquetEnquiryId: {
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
      enquiryCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      enquiryType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      functionType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numberOfGuest: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      eventDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      query: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.dropTable('banquetEnquiry');
  }
};