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

      // 1. Daftar pengguna yang DI-FOLLOW oleh user ini
      User.belongsToMany(models.User, {
        through: models.Follows,
        foreignKey: "followerId", // Kunci di tabel Follows yang merujuk ke user ini
        otherKey: "followingId", // Kunci yang merujuk ke user yang di-follow
        as: "Following", // Alias: user.getFollowing()
      });

      // 2. Daftar pengguna yang MENGIKUTI user ini (Followers)
      User.belongsToMany(models.User, {
        through: models.Follows,
        foreignKey: "followingId", // Kunci di tabel Follows yang merujuk ke user ini
        otherKey: "followerId", // Kunci yang merujuk ke user yang me-follow
        as: "Followers", // Alias: user.getFollowers()
      });

      User.hasMany(models.Smart, {
        foreignKey: 'owner',
        sourceKey: 'firebaseId',
        as: 'smarts', // opsional
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
