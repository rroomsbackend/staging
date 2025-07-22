'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('PropertyMasters', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING,
				defaultValue: null
			},
			gstNumber: {type: Sequelize.STRING, defaultValue: null},
			tanNumber: {type: Sequelize.STRING, defaultValue: null},
			propertyDescription: {type: Sequelize.TEXT, defaultValue: null},
			longitude: {type: Sequelize.STRING, defaultValue: null},
			latitude: {type: Sequelize.STRING, defaultValue: null},
			address: {type: Sequelize.STRING(1200), defaultValue: null},
			countryId: {type: Sequelize.STRING, defaultValue: null},
			stateId:{type: Sequelize.STRING, defaultValue: null},
			city: {type: Sequelize.STRING, defaultValue: null},
			pincode: {type: Sequelize.INTEGER, defaultValue: 0},
			bookingPolicy: {type: Sequelize.INTEGER, defaultValue: 0},
			ownerFirstName: {type: Sequelize.STRING, defaultValue: null},
			ownerLastName: {type: Sequelize.STRING, defaultValue: null},
			ownerMobile: {type: Sequelize.STRING, defaultValue: null},
			ownerEmail: {type: Sequelize.STRING, defaultValue: null},
			ownerPan: {type: Sequelize.STRING, defaultValue: null},
			ownerAdhar: {type: Sequelize.STRING, defaultValue: null},
			partialPayment: {type: Sequelize.INTEGER, defaultValue: 0},
			partialPaymentPercentage: {type: Sequelize.STRING, defaultValue: null},
			partialAmount: {type: Sequelize.FLOAT, defaultValue: 0},
			bookingAmount: {type: Sequelize.FLOAT, defaultValue: 0},
			status: {type: Sequelize.INTEGER, defaultValue: 0},
			noOfRooms: {type: Sequelize.INTEGER, defaultValue: 0},
			remarks: {type: Sequelize.STRING, defaultValue: null},
			approved: {type: Sequelize.INTEGER, defaultValue: 0},
			ownerpanCertificate: {type: Sequelize.STRING, defaultValue: null},
			owneradharCertificate: {type: Sequelize.STRING, defaultValue: null},
			PropertyPanCertificate: {type: Sequelize.STRING, defaultValue: null},
			PropertyPanNumber: {type: Sequelize.STRING, defaultValue: null},
			gstCertificate: {type: Sequelize.STRING, defaultValue: null},
			tanCertificate: {type: Sequelize.STRING, defaultValue: null},
			rentAgreement: {type: Sequelize.STRING, defaultValue: null},
			cancelCheque: {type: Sequelize.STRING, defaultValue: null},
			landmark: {type: Sequelize.STRING, defaultValue: null},
			propertyMobileNumber: {type: Sequelize.STRING, defaultValue: null},
			propertyEmailId: {type: Sequelize.STRING, defaultValue: null},
			firmType: {type: Sequelize.STRING, defaultValue: null},
			bankDetails: {type: Sequelize.STRING, defaultValue: null},
			locaidAccept: {type: Sequelize.INTEGER, defaultValue: 0},
			coupleFriendly: {type: Sequelize.INTEGER, defaultValue: 0},
			status: {
				type: Sequelize.INTEGER(2),
				defaultValue: 0
			},
			createdBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: 0
			},
			updatedBy: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: 0
			},
			deletedBy : {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: 0
			},
			createdAt: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null
			},
			updatedAt: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null
			},
			deletedAt: {
				type: Sequelize.DATE,
				defaultValue: null
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('PropertyMasters');
	}
};
