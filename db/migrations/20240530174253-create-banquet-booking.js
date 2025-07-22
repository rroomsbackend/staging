'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('banquetBooking', {
      banquetBookingId: {
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
      venueId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Venues', 
            key: 'venueId'
        }
    },
    functionId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Functions', 
            key: 'id'
        }
    },
      enquiryCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
      bookingCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: false
      },
      altmobile: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gst: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      remark: {
        type: Sequelize.STRING,
        allowNull: true
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contactPerson: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bookedBy: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reserveBookingDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      menuType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      menuName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      menuItems: {
        type: Sequelize.JSON,
        allowNull: false
      },
      attachmentUrl: {
        type: Sequelize.STRING,
        allowNull: true
    },
      venueTaxableAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      venueTaxAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      venueTotalAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      serviceTaxableAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      serviceTaxAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      serviceTotalAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      subTotal: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalTax: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      extraCharge: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      finalAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      paidAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dueAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bookingStatus: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      numberOfGuests: {
        type: Sequelize.INTEGER,
        allowNull: true
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
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('banquetBooking');
  }
};