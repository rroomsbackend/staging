export default (sequelize, DataTypes) => {
    const FOCRequest = sequelize.define('FOCRequest', {
      propertyId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'PropertyMaster',
          key: 'propertyId'
        },
        field: 'propertyId'
      },
      bookingId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'BookingHotel',
          key: 'bookingId'
        },
        field: 'bookingId'
      },
      amount: DataTypes.FLOAT,
      status: DataTypes.STRING,
      remark: {
        allowNull: true,
        type: DataTypes.STRING
      },
      createdAt: DataTypes.DATE
    }, {
      timestamps: true,
      paranoid: true,
    });
    FOCRequest.associate = function (models) {
      FOCRequest.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
      FOCRequest.belongsTo(models.BookingHotel, {foreignKey: 'bookingId'});
    };
    return FOCRequest;
  };