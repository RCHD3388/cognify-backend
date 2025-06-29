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

      section_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      material_type: {
        type: Sequelize.ENUM('video', 'document', 'other'),
        allowNull: false,
      },

      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

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
