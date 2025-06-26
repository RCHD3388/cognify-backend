"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follows extends Model {
    static associate(models) {
      // Tidak perlu ada asosiasi di sini, karena ini hanya tabel penghubung.
    }
  }
  Follows.init(
    {
      // ID dari pengguna yang melakukan follow
      followerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: "Users",
          key: "firebaseId",
        },
      },
      // ID dari pengguna yang di-follow
      followingId: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: "Users",
          key: "firebaseId",
        },
      },
    },
    {
      sequelize,
      modelName: "Follows",
      timestamps: true, // createdAt akan berguna untuk tahu kapan follow terjadi
      updatedAt: false, // Tidak perlu updatedAt
    }
  );
  return Follows;
};
