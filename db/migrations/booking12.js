'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BookingHotels', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			bookingCode: {
				allowNull: true,
				type: Sequelize.STRING
			},
            userId: {
				allowNull: false,
				type: Sequelize.STRING
			},
			propertyId: {
				allowNull: false,
				type: Sequelize.STRING
			},
			propertyRoomsCategoryId: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			fromDate: {
				allowNull: true,
				type: Sequelize.DATE
			},
            toDate: {
				allowNull: true,
				type: Sequelize.DATE
			},
            noOfRooms: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			adults: {
                allowNull: true,
				type: Sequelize.INTEGER
			},

            children: {
                allowNull: true,
				type: Sequelize.INTEGER
			},
            paymentMode: {
                allowNull: true,
				type: Sequelize.INTEGER
			},
            PaymentStatus: {
                allowNull: true,
				type: Sequelize.INTEGER
			},
            bookingStatus: {
                allowNull: true,
				type: Sequelize.INTEGER
			},
            checkInDateTime: {
                allowNull: true,
				type: Sequelize.DATE
			},
            checkOutDateTime: {
                allowNull: true,
				type: Sequelize.DATE
			},
			bookingAmout: {
                allowNull: true,
				type: Sequelize.FLOAT
			},
			reason: {
				allosNull: true,
				type: Sequelize.STRING
			},
			bookForOther: {
				allosNull: true,
				type: Sequelize.STRING
			},
			otherPersonName: {
				allowNull: true,
				type: Sequelize.STRING
			},
			otherPersonNumber: {
				allowNull: true,
				type: Sequelize.STRING
			},
			source: {
				allowNull: true,
				type: Sequelize.STRING
			},
			assignRoomNo: {
				allowNull: true,
				type: Sequelize.STRING
			},
			collectedPayment: {
				allowNull: true,
				type: Sequelize.FLOAT
			},
			dueAmount: {
				allowNull: true,
				type: Sequelize.FLOAT
			},
			guestDetails: {
				allowNull: true,
				type: Sequelize.STRING
			},
			otaBookingId: {
				allowNull: true,
				type: Sequelize.STRING
			},
			breakFast: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			extraCharge1: {
				allosNull: true,
				type: Sequelize.STRING
			},
			extraCharge2: {
				allosNull: true,
				type: Sequelize.STRING
			},
			bookingHours: {
				allowNull: true,
				type: Sequelize.FLOAT
			},
			createdAt: {
				allowNull: true,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: true,
				type: Sequelize.DATE
			},
			deletedAt: {
				type: Sequelize.DATE
			},
		});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BookingHotels'); 
  }
};
