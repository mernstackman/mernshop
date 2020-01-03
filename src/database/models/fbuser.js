/* eslint-disable no-unused-vars */
"use strict";
module.exports = (sequelize, DataTypes) => {
    const FbUser = sequelize.define(
        "FbUser",
        {
            fb_id: { type: DataTypes.INTEGER, primaryKey: true, unique: true /* , autoIncrement: true */ },
            access_token: DataTypes.STRING,
            user_id: DataTypes.INTEGER,
            expires_in: DataTypes.DATE,
        },
        {
            tableName: "fbusers",
            underscored: true,
            timestamps: true,
        }
    );
    FbUser.associate = function(models) {
        // associate with user
        FbUser.belongsTo(models.User, { foreignKey: "user_id" });
    };
    return FbUser;
};
