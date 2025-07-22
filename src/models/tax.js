export default (sequelize, DataTypes) => {
  const Tax = sequelize.define('Tax', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true,
  });
  Tax.associate = function (models) { };
  return Tax;
};