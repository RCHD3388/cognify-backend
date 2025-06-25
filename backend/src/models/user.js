"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Asosiasi Many-to-Many (Pendaftaran/Enrollment)
      User.belongsToMany(models.Course, {
        through: models.UserCourse,
        foreignKey: "user_id",
        otherKey: "course_id",
        as: "EnrolledCourses",
      });

      // Asosiasi One-to-Many (Kepemilikan/Owner)
      User.hasMany(models.Course, {
        foreignKey: "course_owner",
        as: "OwnedCourses",
      });

      User.hasMany(models.CourseDiscussion, {
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      firebaseId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true, // <-- PERUBAHAN DI SINI
    }
  );
  return User;
};
