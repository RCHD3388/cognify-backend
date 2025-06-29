'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Materials', {
      // Primary Key: Auto-incrementing integer for the ID.
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Title of the material.
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Description content of the material.
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      // Foreign Key: Links this material to a section.
      section_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Sections', // Name of the target table
          key: 'id', // Column in the target table to reference
        },
        onUpdate: 'CASCADE', // Automatically update if the parent section's ID changes.
        onDelete: 'CASCADE', // Automatically delete if the parent section is deleted.
      },
      // Type of Material: Restricted to specific values using ENUM.
      material_type: {
        type: Sequelize.ENUM('video', 'document', 'other'),
        allowNull: false,
      },
      // Position for ordering materials within a section.
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // Timestamps: Automatically managed by Sequelize.
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    // This will remove the table if the migration is reverted.
    await queryInterface.dropTable('Materials');
  },
};
