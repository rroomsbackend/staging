//currently not in use 
export default (sequelize, DataTypes) => {
    const UserType = sequelize.define('UserType', {
        role: DataTypes.STRING,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
    UserType.associate = function (models) {};
    return UserType;
};