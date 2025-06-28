'use strict';

const category = require('../models/category');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      course_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      course_name: {
        type: Sequelize.STRING,
      },
      course_description: {
        type: Sequelize.STRING,
      },
      course_owner: {
        type: Sequelize.STRING,
        allowNull: false, // Sesuaikan jika pemilik bisa null
        references: {
          model: 'Users', // Merujuk ke tabel 'Users'
          key: 'firebaseId', // Merujuk ke kolom 'firebaseId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Jika User (owner) dihapus, Course miliknya juga dihapus.
      },
      course_owner_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      course_rating: {
        type: Sequelize.DECIMAL(10, 2),
      },
      course_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      category_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbnail: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Courses');
  },
};
