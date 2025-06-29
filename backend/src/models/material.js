'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {}
  }
  Material.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      section_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Sections', // Name of the target table
          key: 'id', // Column in the target table to reference
        },
        onUpdate: 'CASCADE', // Automatically update if the parent section's ID changes.
        onDelete: 'CASCADE', // Automatically delete if the parent section is deleted.
      },
      material_type: {
        type: DataTypes.ENUM('video', 'document', 'other'),
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Material',
      timestamps: true,
    }
  );
  return Material;
};
