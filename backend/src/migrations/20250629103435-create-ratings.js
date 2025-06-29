"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Ratings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "Users", key: "firebaseId" },
        onDelete: "CASCADE",
      },
      course_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "Courses", key: "course_id" },
        onDelete: "CASCADE",
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Ratings");
  },
};
