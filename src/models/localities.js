export default (sequelize, DataTypes) => {
    const Locality = sequelize.define('Locality', {
        name: DataTypes.STRING,
        // cityId: DataTypes.INTEGER,
        // stateId: DataTypes.INTEGER,
        // pinCode: DataTypes.INTEGER,
        city_id: DataTypes.INTEGER,
        state_id: DataTypes.INTEGER,
        pin_code: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {
        timestamps: true,
        paranoid: true,
    });
    Locality.associate = function (models) {
        Locality.belongsTo(models.cities, { foreignKey: 'city_id' });
    };
    return Locality;
};