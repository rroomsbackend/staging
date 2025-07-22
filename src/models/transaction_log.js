export default (sequelize, DataTypes) => {
    const TransactionLog = sequelize.define('TransactionLog', {
        transactionId: DataTypes.INTEGER(11),
        status: DataTypes.STRING,
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
    TransactionLog.associate = function (models) { };
    return TransactionLog;
};