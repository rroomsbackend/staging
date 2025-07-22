export default (sequelize, DataTypes) => {
    const Function = sequelize.define('Function', {
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        functionName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: true,
    });
    
    return Function;
};
