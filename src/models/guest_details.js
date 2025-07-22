export default (sequelize, DataTypes) => {
    const GuestDetails = sequelize.define('GuestDetails', {
        bookedId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        gender: DataTypes.STRING,
        document_number: DataTypes.STRING,
        document_type: DataTypes.STRING,
        createdAt: DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
        GuestDetails.associate = function (models) {
            GuestDetails.belongsTo(models.BookingHotel, {foreignKey: 'id'});
        };
    return GuestDetails;
};