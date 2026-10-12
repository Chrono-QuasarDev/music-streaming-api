'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('follows', 'follows_artist_id_fkey');
    await queryInterface.addConstraint('follows', {
      fields: ['artist_id'],
      type: 'foreign key',
      name: 'follows_artist_id_fkey',
      references: {
        table: 'artist_profiles',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('follows', 'follows_artist_id_fkey');
    await queryInterface.addConstraint('follows', {
      fields: ['artist_id'],
      type: 'foreign key',
      name: 'follows_artist_id_fkey',
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
