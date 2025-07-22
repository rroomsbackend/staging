export default (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'User',
        key: 'userId'
      },
      field: 'userId'
    },
    propertyId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'PropertyMaster',
        key: 'propertyId'
      },
      field: 'propertyId'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0
    },
    bookingCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true,
  });
  Rating.associate = function (models) {
    Rating.belongsTo(models.User, {foreignKey: 'userId'});
    Rating.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
  };
  return Rating;
};