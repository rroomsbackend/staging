'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('bookedVenue', {
            bookedVenueId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            venueId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Venues',
                    key: 'venueId'
                }
            },
            functionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Functions',
                    key: 'id'
                }
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
            reserveStartTime: {
                type: Sequelize.TIME,
                allowNull: false
            },
            reserveEndTime: {
                type: Sequelize.TIME,
                allowNull: false
            },
            session: {
                type: Sequelize.STRING,
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
            discountPercentage: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            gstPercentage: {
                type: Sequelize.INTEGER,
                allowNull: true
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
            tableName: 'bookedVenue',
            timestamps: true,
            paranoid: true // Enable soft deletion
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('bookedVenue');
    },
};
