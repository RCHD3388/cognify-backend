"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CourseDiscussions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Users", // Nama tabel User
          key: "firebaseId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Jika user dihapus, postnya juga terhapus
      },
      course_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Courses", // Nama tabel Course
          key: "course_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Jika kursus dihapus, diskusinya juga terhapus
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "CourseDiscussions", // Merujuk ke tabelnya sendiri
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Jika post induk dihapus, semua balasannya juga terhapus
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
    await queryInterface.dropTable("CourseDiscussions");
  },
};
