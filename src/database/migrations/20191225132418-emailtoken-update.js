/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("emailtokens", "expire_in");
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
