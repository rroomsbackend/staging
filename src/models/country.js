export default (sequelize, DataTypes) => {
    const countries = sequelize.define('countries', {
        name: DataTypes.STRING,
        iso3: DataTypes.STRING,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
    });
    countries.associate = function (models) {
    };
    return countries;
};