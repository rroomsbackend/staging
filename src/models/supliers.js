export default (sequelize, DataTypes) => {
    const Supliers = sequelize.define('Supliers', {
        name: DataTypes.STRING,
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        suplierCode: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        mobile: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        adharNumber: {
            type: DataTypes.STRING
        },
        panNumber: {
            type: DataTypes.STRING
        },
        gst: {
            type: DataTypes.STRING
        },
        bankName: {
            type: DataTypes.STRING
        },
        branchName: {
            type: DataTypes.STRING
        },
        accountName: {
            type: DataTypes.STRING
        },
        accountNumber: {
            type: DataTypes.STRING
        },
        ifsc: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER(2),
            defaultValue: 0
        },
        createdBy : {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        deletedBy : {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        createdAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
    }, {
            timestamps: true,
            paranoid: true,
    });
    Supliers.associate = function (models) {
        Supliers.hasOne(models.InventoryInStocks, {foreignKey: 'suplierId'});
    };
    return Supliers;
};