'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Smart extends Model {
    static associate(models) {
      // Pastikan models.User adalah Model Sequelize yang valid
      Smart.belongsTo(models.User, {
        foreignKey: 'owner',
        targetKey: 'firebaseId',
        as: 'user', // alias opsional
      });
    }
  }

  Smart.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.STRING,
    },
    tags: {
      type: DataTypes.STRING,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users', // Ini merujuk ke nama TABEL di DB, bukan nama model
        key: 'firebaseId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }
  }, {
    sequelize,
    modelName: 'Smart',       // <- Gunakan kapitalisasi PascalCase
    tableName: 'smarts',      // <- nama tabel di DB
  });

  return Smart;
};
