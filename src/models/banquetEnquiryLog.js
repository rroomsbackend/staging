export default (sequelize, DataTypes) => {
  const BanquetEnquiryLog = sequelize.define(
    "BanquetEnquiryLog",
    {
      banquetEnquiryLogId: {
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
      banquetEnquiryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "banquetEnquiry",
          key: "banquetEnquiryId",
        },
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "banquetEnquiryLog",
      timestamps: true,
      paranoid: true, // Enable soft deletion
    },
  );

  // Associate with PropertyMaster

  // Associate with BanquetEnquiry
  BanquetEnquiryLog.associate = function (models) {
    BanquetEnquiryLog.belongsTo(models.PropertyMaster, {
      foreignKey: "propertyId",
    });
    BanquetEnquiryLog.belongsTo(models.BanquetEnquiry, {
      foreignKey: "banquetEnquiryId",
    });
  };

  return BanquetEnquiryLog;
};