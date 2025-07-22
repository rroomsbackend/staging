export default (sequelize, DataTypes) => {
    const PropertySearchLog = sequelize.define('PropertySearchLog', {
        request: {
            allowNull: true,
            type: DataTypes.JSON
        },
        response: {
            allowNull: true,
            type: DataTypes.JSON
        },
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    PropertySearchLog.associate = function (models) { };
    return PropertySearchLog;
};