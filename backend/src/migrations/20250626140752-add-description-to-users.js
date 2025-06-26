"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "Users", // Nama tabel
      "description", // Nama kolom baru
      {
        type: Sequelize.TEXT, // Gunakan TEXT untuk deskripsi yang bisa panjang
        allowNull: true, // Boleh bernilai null
        defaultValue: null, // Nilai default adalah null
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "description");
  },
};
