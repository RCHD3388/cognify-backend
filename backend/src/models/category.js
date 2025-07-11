'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definisikan asosiasi di sini jika diperlukan
      // Contoh: Sebuah kategori bisa memiliki banyak course
      // Category.hasMany(models.Course, {
      //   foreignKey: 'category_id',
      // });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING, // Tipe data STRING untuk nama
        allowNull: false, // Tidak boleh kosong
        unique: true, // Sebaiknya nama kategori unik
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: true,
    }
  );

  return Category;
};
