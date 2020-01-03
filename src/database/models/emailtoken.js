"use strict";
module.exports = (sequelize, DataTypes) => {
    const EmailToken = sequelize.define(
        "EmailToken",
        {
            token_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            token: DataTypes.STRING,
            user_id: DataTypes.INTEGER,
            expire_at: DataTypes.DATE,
            createdAt: { type: DataTypes.DATE, field: "createdAt" },
            updatedAt: { type: DataTypes.DATE, field: "updatedAt" },
        },
        {
            tableName: "emailtokens",
            underscored: true,
            timestamps: true,
        }
    );
    EmailToken.associate = function(models) {
        // associate with user
        EmailToken.belongsTo(models.User, { foreignKey: "user_id" });
    };
    return EmailToken;
};
