export default (sequelize, DataTypes) => {
    const PropertyInvoice = sequelize.define('PropertyInvoice', {
        invoice_id: {
            type: DataTypes.BIGINT(20),
            autoIncrement: true,
            primaryKey: true
        },
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PropertyMasters',
                key: 'id'
            },
            field: 'propertyId'
        },
        totalCommission: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0
        },
        totalPayableAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0
        },
        collectedPayment: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0
        },
        totalSale: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0
        },
        sgstPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0
        },
        cgstPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0
        },
        sgstAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        cgstAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        paymentStatus: {
            type: DataTypes.ENUM,
            values: ['paid', 'pending', 'inreview', 'failed'],
            defaultValue: 'pending'
        },
        paymentMode: DataTypes.INTEGER(2),
        paymentSource: DataTypes.STRING,
        paymentDate: DataTypes.DATE,
        documentUrl: DataTypes.STRING,
        merchantTransactionId: DataTypes.STRING,
        invoiceMonth: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        deletedAt: {
            type: DataTypes.DATE
        }
    }, {
        timestamps: true,
        paranoid: true
    });
    PropertyInvoice.associate = function (models) {
        PropertyInvoice.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
    };
    return PropertyInvoice;
};