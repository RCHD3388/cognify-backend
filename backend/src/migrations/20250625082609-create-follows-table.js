"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Follows", {
      followerId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Users",
          key: "firebaseId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      followingId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Users",
          key: "firebaseId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      // updatedAt tidak kita buat
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Follows");
  },
};
