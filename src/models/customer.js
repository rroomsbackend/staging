import string from "joi/lib/types/string";
import { INTEGER } from "sequelize";

export default (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
        userCode: DataTypes.STRING,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        mobile: DataTypes.STRING,
        otp: DataTypes.INTEGER,
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
        Customer.associate = function (models) {};
    return Customer;
};