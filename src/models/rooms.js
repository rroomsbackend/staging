export default (sequelize, DataTypes) => {
    const Rooms = sequelize.define('Rooms', {
        propertyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'PropertyMaster',
                key: 'propertyId'
            },
            field: 'propertyId'
        },
        categoryId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'RroomCategory',
                key: 'categoryId'
            },
            field: 'categoryId'
        },
        minPrice: DataTypes.STRING,
        maxPrice: DataTypes.STRING,
        regularPrice: DataTypes.FLOAT,
        offerPrice: DataTypes.FLOAT,
        roomDescription: DataTypes.STRING,
        occupancy: DataTypes.STRING,
        status: DataTypes.INTEGER(2), 
        breakFastPrice: DataTypes.FLOAT,
        ap: DataTypes.STRING,
        map: DataTypes.STRING,
        heroImage: DataTypes.INTEGER,
        fromDate: DataTypes.DATE,
        toDate: DataTypes.DATE,
        createdAt:DataTypes.DATE,
        updatedAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    Rooms.associate = function (models) {
        Rooms.hasMany(models.RoomImages, {foreignKey: 'roomId'});
        Rooms.hasMany(models.RoomAmenities, {foreignKey: 'roomId'});
        Rooms.hasMany(models.RoomDetails, {foreignKey: 'roomId'});
        Rooms.belongsTo(models.PropertyMaster, {foreignKey: 'propertyId'});
        Rooms.belongsTo(models.RroomCategory, {foreignKey: 'categoryId'});
    };
    return Rooms;
};