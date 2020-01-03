/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

        return [
            await queryInterface.addColumn("users", "access_token", { type: Sequelize.STRING, defaultValue: null }),
            await queryInterface.addColumn("users", "expires_in", { type: Sequelize.DATE, defaultValue: null }),
        ];
    },

    down: (queryInterface, Sequelize) => {
        /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    },
};
