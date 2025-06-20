"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserCourses", {
      // Foreign Key untuk User
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true, // Bagian dari composite primary key
        references: {
          model: "Users",
          key: "firebaseId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Jika User atau Course dihapus, pendaftaran ini juga dihapus.
      },
      // Foreign Key untuk Course
      course_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true, // Bagian dari composite primary key
        references: {
          model: "Courses",
          key: "course_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // Model UserCourse hanya memiliki createdAt
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserCourses");
  },
};
