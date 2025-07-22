module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RestaurantFoodOrders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // userId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'Users',
      //     key: 'id'
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'SET NULL'
      // },
      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'PropertyMasters', 
            key: 'id'
        }
    },
      roomNumber: {
        type: Sequelize.STRING
      },
      orderAmount: {
        type: Sequelize.INTEGER
      },
      paidAmount: {
        type: Sequelize.INTEGER
      },
      paymentStatus: {
        type: Sequelize.INTEGER
      },
      orderStatus: {
        type: Sequelize.INTEGER
      },
      orderNote: {
        type: Sequelize.STRING
      },
      orderType: {
        type: Sequelize.STRING
      },
      otherGuestName: {
        type: Sequelize.STRING
      },
      orderItems: {
        type: Sequelize.INTEGER
      },
      remark: {
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      customerMobile: {
        type: Sequelize.STRING
      },
      customerEmail: {
        type: Sequelize.STRING
      },
      customerGst: {
        type: Sequelize.STRING
      },
      bookingId: {
        type: Sequelize.INTEGER,
      },
      tableNumber:{
        type: Sequelize.INTEGER,
      },
      orderItems: {
        type: Sequelize.JSON
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
    }, {
      paranoid: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RestaurantFoodOrders');
  }
};
