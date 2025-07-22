export default (sequelize, DataTypes) => {
    const RestaurantBookings = sequelize.define('RestaurantBookings', {
        tableNumber: DataTypes.INTEGER,
        capacity: DataTypes.INTEGER,
        status: DataTypes.ENUM('Available', 'Occupied', 'Reserved'),
        
        bookingTime: DataTypes.DATE,
        
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PropertyMasters', 
                key: 'id'
            }
        },
    }, {
        timestamps: true,
        paranoid: true,
    }
);
RestaurantBookings.associate = function (models) {
    RestaurantBookings.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
};
    return RestaurantBookings;
};
