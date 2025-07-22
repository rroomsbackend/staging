export default (sequelize, DataTypes) => {
  const RoomPriceSetting = sequelize.define('RoomPriceSetting', {
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
  RoomPriceSetting.associate = function (models) { };
  return RoomPriceSetting;
};