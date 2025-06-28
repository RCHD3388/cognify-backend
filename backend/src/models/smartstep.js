'use strict';
const { all } = require('axios');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SmartStep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SmartStep.init({
    smartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stepNumber: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    estimatedTime: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'smartstep',
    tableName: 'smartsteps', // nama tabel di database
  });
  return SmartStep;
};