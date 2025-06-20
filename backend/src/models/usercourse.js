"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    static associate(models) {
      // Tidak perlu mendefinisikan asosiasi di sini karena
      // model ini hanya bertindak sebagai tabel penghubung (through table)
    }
  }
  UserCourse.init(
    {
      // Foreign key untuk User
      user_id: {
        type: DataTypes.STRING,
        references: {
          model: "Users", // Nama tabel, bukan model
          key: "firebaseId",
        },
        primaryKey: true, // Bagian dari composite primary key
      },
      // Foreign key untuk Course
      course_id: {
        type: DataTypes.STRING,
        references: {
          model: "Courses", // Nama tabel, bukan model
          key: "course_id",
        },
        primaryKey: true, // Bagian dari composite primary key
      },
    },
    {
      sequelize,
      modelName: "UserCourse",
      // Kita hanya butuh createdAt, tidak perlu updatedAt
      timestamps: true,
      updatedAt: false, // Nonaktifkan updatedAt
    }
  );
  return UserCourse;
};
