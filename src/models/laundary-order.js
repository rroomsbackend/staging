export default (sequelize, DataTypes) => {
  const LaundaryOrder = sequelize.define('LaundaryOrder', {
    propertyId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'PropertyMaster',
        key: 'propertyId'
      },
      field: 'propertyId'
    },
    createdAt: DataTypes.DATE,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER,
  }, {
    timestamps: true,
    paranoid: true,
  });
  LaundaryOrder.associate = function (models) {
    LaundaryOrder.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
    LaundaryOrder.hasMany(models.LaundaryRequest, {foreignKey: 'orderId'});
  };
  return LaundaryOrder;
};