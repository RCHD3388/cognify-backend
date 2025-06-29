"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Sections", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            course_id: {
                type: Sequelize.STRING, // <-- TIPE DATA HARUS SAMA PERSIS dengan PK di 'Courses'
                allowNull: false,
                references: {
                    model: "Courses", // Nama tabel target (jamak, case-sensitive)
                    key: "course_id", // Nama kolom primary key di tabel target
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE", // Jika course dihapus, semua section-nya ikut terhapus
            },
            title: {
                type: Sequelize.STRING,
            },
            position: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("Sections");
    },
};
