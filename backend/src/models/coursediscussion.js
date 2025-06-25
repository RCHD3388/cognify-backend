"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourseDiscussion extends Model {
    static associate(models) {
      // Sebuah post diskusi dibuat oleh satu User
      CourseDiscussion.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "Author", // Alias untuk penulis
      });

      // Sebuah post diskusi milik satu Course
      CourseDiscussion.belongsTo(models.Course, {
        foreignKey: "course_id",
      });

      // --- Untuk Diskusi Berbalas (Threaded) ---
      // Sebuah post bisa memiliki banyak balasan (Replies)
      CourseDiscussion.hasMany(models.CourseDiscussion, {
        foreignKey: "parent_id",
        as: "Replies",
      });

      // Sebuah post (balasan) bisa memiliki satu induk (Parent)
      CourseDiscussion.belongsTo(models.CourseDiscussion, {
        foreignKey: "parent_id",
        as: "Parent",
      });
    }
  }
  CourseDiscussion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT, // Gunakan TEXT untuk pesan yang bisa panjang
        allowNull: false,
      },
      user_id: {
        // Foreign Key ke tabel User
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_id: {
        // Foreign Key ke tabel Course
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_id: {
        // Foreign Key ke dirinya sendiri (untuk balasan)
        type: DataTypes.INTEGER,
        allowNull: true, // Boleh null jika ini adalah post utama, bukan balasan
      },
    },
    {
      sequelize,
      modelName: "CourseDiscussion",
      tableName: "CourseDiscussions", // Eksplisit tentukan nama tabel
      timestamps: true,
    }
  );
  return CourseDiscussion;
};
