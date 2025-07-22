export default (sequelize, DataTypes) => {
    const UserWallet = sequelize.define('UserWallet', {
        userId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'User',
                key: 'userId'
            },
            field: 'userId'
        },
        amount: DataTypes.FLOAT,
        balance: DataTypes.FLOAT,
        transactionType: { // e.g false == debit, true == credit
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    UserWallet.associate = function (models) {
        UserWallet.belongsTo(models.User, { foreignKey: 'userId' });
    };
    return UserWallet;
};