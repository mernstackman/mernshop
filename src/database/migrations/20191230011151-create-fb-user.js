/* eslint-disable no-unused-vars */
"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("FbTokens", {
            fb_id: {
                allowNull: false,
                // autoIncrement: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                unique: true,
            },
            access_token: {
                type: Sequelize.STRING,
            },
            expires_in: {
                type: Sequelize.DATE,
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "users",
                    key: "user_id",
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("FbTokens");
    },
};
