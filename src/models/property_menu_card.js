export default (sequelize, DataTypes) => {
  const PropertyMenuCard = sequelize.define('PropertyMenuCard', {
    propertyId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'PropertyMaster',
        key: 'propertyId'
      },
      field: 'propertyId'
    },
    menuCard: {
      allowNull: false,
      type: DataTypes.STRING
    },
    status: DataTypes.STRING,
    createdAt: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true,
  });
  PropertyMenuCard.associate = function (models) {
    PropertyMenuCard.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
  };
  return PropertyMenuCard;
};