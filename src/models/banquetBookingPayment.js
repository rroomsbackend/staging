export default (sequelize, DataTypes) => {
  const BanquetBookingPayment = sequelize.define(
    "BanquetBookingPayment",
    {
      banquatBookingPaymentId: {
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
      banquetBookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "banquetBooking",
          key: "banquetBookingId",
        },
      },
      paidAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymentSource: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      referenceNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentDate: {
        type: DataTypes.DATE,
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
      tableName: "banquetBookingPayment",
      timestamps: true,
      paranoid: true, // Enable soft deletion
    },
  );

  // Associate with PropertyMaster
  // BanquetBookingPayment.belongsTo(PropertyMaster, { foreignKey: 'propertyID' });
  BanquetBookingPayment.associate = function (models) {
    BanquetBookingPayment.belongsTo(models.PropertyMaster, {
      foreignKey: "propertyId",
    });
    BanquetBookingPayment.belongsTo(models.BanquetBooking, {
      foreignKey: "banquetBookingId",
    });
  };

  return BanquetBookingPayment;
};