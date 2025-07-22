import { FlowValidateInstance } from "twilio/lib/rest/studio/v2/flowValidate";

export default (sequelize, DataTypes) => {
  const LaundaryProvider = sequelize.define('LaundaryProvider', {
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
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    providerCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    alternateMobile: {
      type: DataTypes.STRING,
      allowNull: FlowValidateInstance
    },
    panNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gst: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    branchName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ifsc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true,
  });
  LaundaryProvider.associate = function (models) {
    LaundaryProvider.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
  };
  return LaundaryProvider;
};