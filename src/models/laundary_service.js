export default (sequelize, DataTypes) => {
  const LaundaryService = sequelize.define('LaundaryService', {
    propertyId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'PropertyMaster',
        key: 'propertyId'
      },
      field: 'propertyId'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    providerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createdAt: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true,
  });
  LaundaryService.associate = function (models) {
    LaundaryService.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
  };
  return LaundaryService;
};