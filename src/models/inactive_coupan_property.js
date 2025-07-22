export default (sequelize, DataTypes) => {
    const InactiveCoupanProperties = sequelize.define('InactiveCoupanProperties', {
        propertyId: DataTypes.INTEGER(11),
        couponId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'Coupon',
                key: 'couponId'
            },
            field: 'couponId'
        },
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
        deletedBy: DataTypes.INTEGER,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    InactiveCoupanProperties.associate = function (models) {
        InactiveCoupanProperties.belongsTo(models.Coupon, {foreignKey: 'couponId'});
    };
    return InactiveCoupanProperties;
};