'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firebaseId: { 
      type: DataTypes.STRING, 
      primaryKey: true 
    },
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    role: { 
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};