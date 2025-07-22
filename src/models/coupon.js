export default (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    propertyId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'PropertyMaster',
        key: 'propertyId'
      },
      field: 'propertyId'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: DataTypes.INTEGER(2),
    offerMode: DataTypes.INTEGER(1),
    isOneTimePerUser: DataTypes.INTEGER(2),
    allowChange: DataTypes.INTEGER(2),
    updatedPrice: DataTypes.STRING,
    startAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookingFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookingTo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true,
  });
  Coupon.associate = function (models) {
    Coupon.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
    Coupon.hasMany(models.InactiveCoupanProperties, {foreignKey: 'couponId'});
  };
  return Coupon;
};