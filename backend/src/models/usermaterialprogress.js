'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMaterialProgress extends Model {
    static associate(models) {}
  }
  UserMaterialProgress.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.STRING,
      material_id: DataTypes.INTEGER,
      viewed_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'UserMaterialProgress',
    }
  );
  return UserMaterialProgress;
};
