'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // 1. Asosiasi Many-to-Many (Pendaftaran/Enrollment)
      // Course bisa diikuti oleh banyak User melalui tabel UserCourse.
      Course.belongsToMany(models.User, {
        through: models.UserCourse,
        foreignKey: 'course_id',
        otherKey: 'user_id',
        as: 'EnrolledUsers', // Alias untuk membedakan dengan 'Owner'
      });

      // 2. Asosiasi One-to-Many (Kepemilikan/Owner)
      // Satu Course dimiliki oleh satu User (sebagai Owner).
      Course.belongsTo(models.User, {
        foreignKey: 'course_owner', // Kolom di tabel Course yang menyimpan FK
        as: 'Owner', // Alias untuk asosiasi ini
      });

      Course.hasMany(models.CourseDiscussion, {
        foreignKey: 'course_id',
      });
    }
  }
  Course.init(
    {
      course_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      course_name: DataTypes.STRING,
      course_description: DataTypes.STRING,
      course_owner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_rating: DataTypes.DECIMAL(10, 2),
      course_price: DataTypes.NUMBER,
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thumbnail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Course',
      timestamps: true,
    }
  );
  return Course;
};
