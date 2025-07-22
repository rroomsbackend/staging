export default (sequelize, DataTypes) => {
    const PropertyInvoiceTransaction = sequelize.define('PropertyInvoiceTransaction', {
        invoice_id: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            references: {
                model: 'PropertyInvoice',
                key: 'invoice_id'
            },
            field: 'invoice_id'
        },
        amount: DataTypes.FLOAT,
        status: DataTypes.STRING,
        merchantTransactionId: DataTypes.STRING,
        merchantUserId: DataTypes.STRING,
        request: {
            type: DataTypes.TEXT,
            set: function(value) {
              return this.setDataValue("request", JSON.stringify(value));
            }
        },
        response: {
            type: DataTypes.TEXT,
            set: function(value) {
              return this.setDataValue("response", JSON.stringify(value));
            }
        },
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    PropertyInvoiceTransaction.associate = function (models) {
        PropertyInvoiceTransaction.belongsTo(models.PropertyInvoice, { foreignKey: 'invoice_id' });
    };
    return PropertyInvoiceTransaction;
};