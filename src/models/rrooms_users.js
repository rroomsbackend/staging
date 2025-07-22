import bcrypt from 'bcrypt-nodejs';

export default (sequelize, DataTypes) => {
    const RroomsUser = sequelize.define('RroomsUser', {
        userCode: DataTypes.STRING,
        role: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'Roles',
                key: 'role'
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
        status: DataTypes.INTEGER(2),
        createdAt: DataTypes.DATE,
        lastLogged: DataTypes.DATE,
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
        otp: DataTypes.INTEGER
    }, {
        timestamps: true,
        paranoid: true,
    });
    RroomsUser.associate = function (models) {
        RroomsUser.belongsTo(models.Roles, { foreignKey: 'role' });
    };

    RroomsUser.prototype.comparePassword = function (password) {
        var dbPass = this.getDataValue('password');
        return bcrypt.compareSync(password, dbPass);
    }
    return RroomsUser;
};