export default (sequelize, DataTypes) => {
    const Venue = sequelize.define('Venue', {
        venueId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        venueName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gstPercent: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        
    }, {
        timestamps: true,
        paranoid: true,
    });
    
    return Venue;
};