export default (sequelize, DataTypes) => {
    const Roles = sequelize.define('Roles', {
        roleName: DataTypes.STRING,
        roleCode: DataTypes.STRING,
        status: DataTypes.INTEGER(2),
        userType: {
            type: DataTypes.ENUM("propertyUser", "rroomsUser"),
            allowNull: false,
            defaultValue: "rroomsUser",
        },
        canEdit: { type: DataTypes.INTEGER(1), allowNull: false, defaultValue: false },
        canDelete: { type: DataTypes.INTEGER(1), allowNull: false, defaultValue: false },
        canAdd: { type: DataTypes.INTEGER(1), allowNull: false, defaultValue: false },
        canView: { type: DataTypes.INTEGER(1), allowNull: false, defaultValue: true },
        createdAt: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
    });
    Roles.associate = function (models) {
        Roles.hasOne(models.PropertyUser, { foreignKey: 'role' });
        Roles.hasOne(models.RroomsUser, { foreignKey: 'role' });
    };
    return Roles;
};