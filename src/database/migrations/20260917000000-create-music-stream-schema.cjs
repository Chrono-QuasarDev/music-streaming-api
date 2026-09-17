"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.ENUM("listener", "artist", "admin"), defaultValue: "listener" },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
    });

    await queryInterface.createTable("artist_profiles", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      bio: { type: Sequelize.STRING(1000), allowNull: false },
      profile_picture_url: { type: Sequelize.STRING(2048), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
    });

    await queryInterface.createTable("songs", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      title: { type: Sequelize.STRING(255), allowNull: false },
      artist_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "artist_profiles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      album_name: { type: Sequelize.STRING(255), allowNull: false },
      track_number: { type: Sequelize.INTEGER, allowNull: false },
      duration_ms: { type: Sequelize.INTEGER, allowNull: false },
      file_path: { type: Sequelize.STRING(2048), allowNull: false, unique: true },
      genre: { type: Sequelize.STRING, allowNull: false },
      release_date: { type: Sequelize.DATEONLY, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
    });

    await queryInterface.createTable("playlists", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      name: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
    });

    await queryInterface.createTable("playlists_songs", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      playlist_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "playlists", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      song_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "songs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      added_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
    });

    await queryInterface.addConstraint("playlists_songs", {
      fields: ["playlist_id", "song_id"],
      type: "unique",
      name: "playlists_songs_playlist_id_song_id_unique"
    });

    await queryInterface.createTable("follows", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      artist_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      follower_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      followed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
    });

    await queryInterface.addConstraint("follows", {
      fields: ["artist_id", "follower_id"],
      type: "unique",
      name: "follows_artist_id_follower_id_unique"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("follows");
    await queryInterface.dropTable("playlists_songs");
    await queryInterface.dropTable("playlists");
    await queryInterface.dropTable("songs");
    await queryInterface.dropTable("artist_profiles");
    await queryInterface.dropTable("users");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  }
};