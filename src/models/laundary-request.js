export default (sequelize, DataTypes) => {
  const LaundaryRequest = sequelize.define('LaundaryRequest', {
    orderId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'LaundaryOrder',
        key: 'orderId'
      },
      field: 'orderId'
    },
    serviceId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'LaundaryService',
        key: 'serviceId'
      },
      field: 'serviceId'
    },
    providerId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'LaundaryProvider',
        key: 'providerId'
      },
      field: 'providerId'
    },
    quantity: DataTypes.INTEGER,
    inQty: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    totalServiceAmount: DataTypes.INTEGER,
    remark: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    status: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    receivedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true,
  });
  LaundaryRequest.associate = function (models) {
    LaundaryRequest.belongsTo(models.LaundaryOrder, {foreignKey: 'orderId'});
    LaundaryRequest.belongsTo(models.LaundaryService, {foreignKey: 'serviceId'});
    LaundaryRequest.belongsTo(models.LaundaryProvider, {foreignKey: 'providerId'});
  };
  return LaundaryRequest;
};