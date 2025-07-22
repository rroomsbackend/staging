import bcrypt from 'bcrypt-nodejs';

export default (sequelize, DataTypes) => {
    const PropertyUser = sequelize.define('PropertyUser', {
        propertyId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'PropertyMasters',
                key: 'id'
            },
            field: 'propertyId'
        },
        userCode: DataTypes.STRING,
        role: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'Roles',
                key: 'id'
            },
            field: 'role'
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        designation: DataTypes.STRING,
        email: DataTypes.STRING,
        mobile: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            // get() {
            //     return undefined;
            // }
        },
        fcmToken: DataTypes.STRING,
        status: DataTypes.INTEGER(2),
        agreement: DataTypes.STRING,
        otp: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        lastLogged: DataTypes.DATE,
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER
    }, {
        timestamps: true,
        paranoid: true,
    });
    PropertyUser.associate = function (models) {
        PropertyUser.belongsTo(models.PropertyMaster, { foreignKey: 'propertyId' });
        PropertyUser.belongsTo(models.Roles, { foreignKey: 'role' });
        PropertyUser.hasOne(models.InventoryOutStocks, { foreignKey: 'employeeId' });
        PropertyUser.hasMany(models.UserProperty, { foreignKey: 'propertyUserId' });
        PropertyUser.hasMany(models.PropertyModuleConfig, { foreignKey: 'propertyUserId' });
    };

    PropertyUser.prototype.comparePassword = function (password) {
        var dbPass = this.getDataValue('password');
        return bcrypt.compareSync(password, dbPass);
    }
    return PropertyUser;
};