// models/Hub.js
module.exports = (sequelize, DataTypes) => {
    const Hub = sequelize.define('Hub', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        hubname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'states',
                key: 'id',
            },
        },
    }, {
        tableName: 'hubs',
        timestamps: false,
    });

    Hub.associate = (models) => {
        Hub.belongsTo(models.states, { foreignKey: 'state_id' });
    };

    return Hub;
};
