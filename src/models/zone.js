// models/Zone.js
module.exports = (sequelize, DataTypes) => {
    const Zone = sequelize.define('Zone', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'zones',
        timestamps: false,
    });

    return Zone;
};
