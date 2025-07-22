module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RestaurantFoodOrderPayments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'RestaurantFoodOrders', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      transactionId: {
        type: Sequelize.STRING
      },
      propertyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PropertyMasters',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      paymentAmount: {
        type: Sequelize.INTEGER
      },
      paymentMode: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RestaurantFoodOrderPayments');
  }
};