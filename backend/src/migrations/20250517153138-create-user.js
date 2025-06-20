"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      firebaseId: {
        type: Sequelize.STRING,
        allowNull: false, // <-- TAMBAHKAN INI
        primaryKey: true, // <-- TAMBAHKAN INI (PALING PENTING)
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // <-- TAMBAHKAN INI (PRAKTIK TERBAIK)
        unique: true, // <-- TAMBAHKAN INI (PRAKTIK TERBAIK)
      },
      name: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: "user",
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
