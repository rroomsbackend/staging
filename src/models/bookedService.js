export default (sequelize, DataTypes) => {
  const BookedService = sequelize.define(
    "BookedService",
    {
      bookedServiceId: {
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
      reservedDate: {
        type: DataTypes.DATE,
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
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expectedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discountPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gstPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "bookedService",
      timestamps: true,
      paranoid: true, // Enable soft deletion
    },
  );

  // Associate with PropertyMaster

  BookedService.associate = function (models) {
    BookedService.belongsTo(models.PropertyMaster, {
      foreignKey: "propertyId",
    });
    BookedService.belongsTo(models.BanquetBooking, {
      foreignKey: "banquetBookingId",
    });
  };
  return BookedService;
};