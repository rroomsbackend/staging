export default (sequelize, DataTypes) => {
  const BookedVenue = sequelize.define(
    "BookedVenue",
    {
      bookedVenueId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      venueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Venues",
          key: "venueId",
        },
      },
      functionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Functions",
          key: "id",
        },
      },
      propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PropertyMasters",
          key: "id",
        },
      },
      banquetBookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "banquetBooking",
          key: "banquetBookingId",
        },
      },
      reservedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reserveStartTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      reserveEndTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      session: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discountPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gstPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "bookedVenue",
      timestamps: true,
      paranoid: true, // Enable soft deletion
    },
  );

  // Associate with PropertyMaster

  BookedVenue.associate = function (models) {
    BookedVenue.belongsTo(models.PropertyMaster, { foreignKey: "propertyId" });
    BookedVenue.belongsTo(models.BanquetBooking, {
      foreignKey: "banquetBookingId",
    });
    BookedVenue.belongsTo(models.Venue, { foreignKey: "venueId" });
    BookedVenue.belongsTo(models.Function, { foreignKey: "functionId" });
  };
  return BookedVenue;
};