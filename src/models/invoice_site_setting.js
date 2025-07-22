export default (sequelize, DataTypes) => {
    const InvoiceSiteSetting = sequelize.define('InvoiceSiteSetting', {
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
              model: 'PropertyMaster',
              key: 'propertyId'
            },
            field: 'propertyId'
        },
        logo: DataTypes.STRING,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.STRING(1200),
        gstNumber: DataTypes.STRING,
        content: DataTypes.TEXT,
        queryContactNumber: DataTypes.STRING,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    InvoiceSiteSetting.associate = function (models) {
        InvoiceSiteSetting.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
    };
    return InvoiceSiteSetting;
};
