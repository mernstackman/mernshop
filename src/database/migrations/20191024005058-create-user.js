/* eslint-disable no-unused-vars */
"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        console.log("queryInterface", queryInterface);
        console.log("Sequelize", Sequelize);
        return queryInterface.createTable("Users", {
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: Sequelize.STRING(20),
                allowNull: true,
                unique: true,
                validate: {
                    is: ["^[a-z0-9_]+$", "i"],
                    msg: "Username can only contain letters, numbers and underscores",
                    len: [3, 20],
                    noEmpty: true,
                },
            },
            email: {
                type: Sequelize.STRING(100),
                unique: true,
                allowNull: false,
                validate: {
                    noEmpty: true,
                    isEmail: true,
                },
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true,
                validate: {
                    len: { args: [6, 100], msg: "Password length should be between 6 to 100 characters" },
                    noEmpty: true,
                },
            },
            salt: Sequelize.STRING,
            first_name: Sequelize.STRING(50),
            last_name: Sequelize.STRING(50),
            address: Sequelize.STRING(100),
            city: Sequelize.STRING(100),
            state: Sequelize.STRING(100),
            country: Sequelize.STRING(100),
            postal_code: Sequelize.STRING(10),

            phone: {
                type: Sequelize.STRING(14),
                validate: { isNumeric: { msg: "Phone can only contain numbers" } },
            },
            createdAt: { allowNull: false, type: Sequelize.DATE, field: "created_at" },
            updatedAt: { allowNull: false, type: Sequelize.DATE, field: "updated_at" },
            deletedAt: { type: Sequelize.DATE, field: "deleted_at" },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("Users");
    },
};
