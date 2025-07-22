export default (sequelize, DataTypes) => {
  const BanquetBooking = sequelize.define(
    "BanquetBooking",
    {
      banquetBookingId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PropertyMasters",
          key: "id",
        },
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
      enquiryCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bookingCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      altmobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pan: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gst: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPerson: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bookedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reserveBookingDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      menuType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      menuName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      menuItems: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      venueTaxableAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      venueTaxAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      venueTotalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      serviceTaxableAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      serviceTaxAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      serviceTotalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalTax: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      extraCharge: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      finalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paidAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dueAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookingStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numberOfGuests: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "banquetBooking",
      timestamps: true,
      paranoid: true, // Enable soft deletion
    },
  );

  // Associate with PropertyMaster
  BanquetBooking.associate = function (models) {
    BanquetBooking.belongsTo(models.PropertyMaster, {
      foreignKey: "propertyId",
    });
    // BanquetBooking.belongsTo(models.BanquetEnquiry, {foreignKey: 'banquetEnquiryId'})
    BanquetBooking.belongsTo(models.Venue, { foreignKey: "venueId" });
    BanquetBooking.belongsTo(models.Function, { foreignKey: "functionId" });
  };

  return BanquetBooking;
};