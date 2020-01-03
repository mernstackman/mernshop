/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.changeColumn("users", "password", {
                type: Sequelize.STRING,
                allowNull: true,
                validate: {
                    len: { args: [6, 100], msg: "Password length should be between 6 to 100 characters" },
                    noEmpty: true,
                },
            }),
            await queryInterface.changeColumn("users", "username", {
                type: Sequelize.STRING(20),
                allowNull: true,
                unique: true,
                validate: {
                    is: ["^[a-z0-9_]+$", "i"],
                    msg: "Username can only contain letters, numbers and underscores",
                    len: [3, 20],
                    noEmpty: true,
                },
            }),
        ];
    },

    down: (queryInterface, Sequelize) => {},
};
