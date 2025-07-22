'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ModuleConfigMenuMasters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ModuleConfigGroupMasters',
          key: 'id'
        },
        field: 'groupId'
      },
      menuName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      webRoute: {
        allowNull: false,
        type: Sequelize.STRING
      },
      appRoute: {
        allowNull: false,
        type: Sequelize.STRING
      },
      icon: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // Add unique constraint on groupType and menuName combination
    await queryInterface.addConstraint('ModuleConfigMenuMasters', {
      type: 'unique',
      fields: ['groupId', 'menuName'],
      name: 'unique_group_menu'
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove unique constraint
    await queryInterface.removeConstraint('ModuleConfigMenuMasters', 'unique_group_menu');

    await queryInterface.dropTable('ModuleConfigMenuMasters');
  }
};