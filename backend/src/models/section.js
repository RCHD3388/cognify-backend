'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate(models) {}
  }
  Section.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },

      course_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // A default value is often useful
      },
    },
    {
      sequelize,
      modelName: 'Section',
      tableName: 'Sections',
      timestamps: true,
    }
  );
  return Section;
};
