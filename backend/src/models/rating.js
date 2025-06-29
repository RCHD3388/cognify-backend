"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      // Setiap rating milik satu User
      Rating.belongsTo(models.User, { foreignKey: "user_id", as: "Author" });
      // Setiap rating milik satu Course
      Rating.belongsTo(models.Course, { foreignKey: "course_id" });
    }
  }
  Rating.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      rating: {
        // Nilai rating, misal: 1-5
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true, // Komentar bersifat opsional
      },
      user_id: { type: DataTypes.STRING, allowNull: false },
      course_id: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Rating",
      timestamps: true,
    }
  );
  return Rating;
};
