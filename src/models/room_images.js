export default (sequelize, DataTypes) => {
    const RoomImages = sequelize.define('RoomImages', {
        roomId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'Rooms',
                key: 'roomId'
            },
            field: 'roomId'
        },
        imageName: DataTypes.STRING,
        status: DataTypes.INTEGER(2), 
        createdAt:DataTypes.DATE,
        updatedAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
        RoomImages.associate = function (models) {
            RoomImages.belongsTo(models.Rooms, {foreignKey: 'roomId'});
        };
    return RoomImages;
};