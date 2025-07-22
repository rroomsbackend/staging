export default (sequelize, DataTypes) => {
    const Enquiries = sequelize.define('Enquiries', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        mobile: DataTypes.STRING,
        propertyName: DataTypes.STRING,
        addressLine1: {
            allowNull: true,
            type: DataTypes.STRING
        },
        addressLine2: {
            allowNull: true,
            type: DataTypes.STRING
        },
        stateId: {
            allowNull: true,
            type: DataTypes.STRING
        },
        city: {
            allowNull: true,
            type: DataTypes.STRING
        },
        pincode: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        remark: {
            allowNull: true,
            type: DataTypes.STRING
        },
        assignTo: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'RroomsUser',
                key: 'assignTo'
            },
            field: 'assignTo'
        },
        createdAt:DataTypes.DATE
    }, {
            timestamps: true,
            paranoid: true,
        });
        Enquiries.associate = function (models) {
            Enquiries.belongsTo(models.RroomsUser, {foreignKey: 'assignTo'});
        };
    return Enquiries;
};