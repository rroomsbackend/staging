import { PropertyMaster } from "./property_master";

export default (sequelize, DataTypes) => {
  const BanquetEnquiry = sequelize.define(
    "BanquetEnquiry",
    {
      banquetEnquiryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PropertyMasters",
          key: "id",
        },
      },
      enquiryCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      enquiryType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      functionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numberOfGuest: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      query: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      followUpDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "banquetEnquiry",
      timestamps: true,
      paranoid: true, // Enable soft deletion
    },
  );

  // Associate with PropertyMaster
  BanquetEnquiry.associate = function (models) {
    BanquetEnquiry.belongsTo(models.PropertyMaster, {
      foreignKey: "propertyId",
    });
  };

  return BanquetEnquiry;
};