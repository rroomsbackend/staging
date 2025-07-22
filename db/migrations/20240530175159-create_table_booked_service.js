'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('bookedService', {
            bookedServiceId: {
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
            reservedDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            serviceName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            rate: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            expectedQuantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            discountPercentage: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            gstPercentage: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            totalAmount: {
                type: Sequelize.INTEGER,
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
              },
        }, {
            tableName: 'bookedService',
            timestamps: true,
            paranoid: true // Enable soft deletion
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('bookedService');
    },
};
