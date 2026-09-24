import { Op } from "sequelize";
import Playlist from "../../database/models/playlist.model.js";
import PlaylistSong from "../../database/models/playlistSongs.model.js";
import Song from "../../database/models/songs.model.js";
import User from "../../database/models/user.model.js";
import ArtistProfile from "../../database/models/artistProfile.model.js";
import { ApiError } from "../../shared/utils/ApiError.js";

// Create a new playlist
export const createPlaylist = async (id, name) => {
  const isExits = await Playlist.findOne({ where: { userId: id, name } });
  if (isExits) throw new ApiError(400, 'Playlist name already exists');

  const playlist = await Playlist.create({
    userId: id,
    name
  });

  return playlist;
}

// Get all playlists for the current user
export const getAllPlaylists = async (id) => {
  const playlists = await Playlist.findAll({
    where: { userId: id },
    attributes: ['id', 'userId', 'name']
  });
  return playlists;
}

// Get information about a specific playlist
export const getPlaylistInfo = async (id) => {
  const playlist = await Playlist.findByPk(id, {
    attributes: ['id', 'name'],
    include: [
      { 
        model: Song, as: 'songs',
        attributes: ['id', 'title', 'artistId', 'durationMs', 'genre', 'releaseDate'],
        through: { attributes: [], },
        include: [
          { 
            model: ArtistProfile,
            attributes: ['id', 'bio', 'profilePictureUrl'],
            include: [{ model: User, attributes: ['username'] }]
          }
        ]
      }
    ],
    order: [[{ model: Song, as: 'songs' }, PlaylistSong, 'addedAt', 'ASC']]
  });

  if (!playlist) throw new ApiError(404, 'Playlist not found');

  return playlist;
}

// Update a playlist
export const playlistUpdate = async (playlist, name) => {
  const playlistName = await Playlist.findOne({ 
    where: { 
      userId: playlist.userId, 
      name,
      id: { [Op.ne]: playlist.id }
    } 
  });
  if (playlistName) throw new ApiError(400, 'Playlist name already exists');

  await playlist.update({ name });

  return playlist;
}

// Delete a playlist
export const playlistDelete = async (playlistData) => {
  await playlistData.destroy();
  return playlistData;
}

// Add a song to a playlist
export const addSong = async (playlistId, songId) => {
  const song = await Song.findByPk(songId);
  if (!song) throw new ApiError(404, 'Song not found');

  let playlistSong;
  let created;

  try {
    [ playlistSong, created ] = await PlaylistSong.findOrCreate({
      where: {
        playlistId,
        songId
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      throw new ApiError(404, 'Song not found');
    }
    throw error;
  }

  if (!created) throw new ApiError(400, 'Song is already in the playlist');

  return playlistSong;
}

// Remove a song from a playlist
export const removeSong = async (playlist, songId) => {
  const song = await PlaylistSong.findOne({
    where: {
      playlistId: playlist.id,
      songId
    }
  });
  if (!song) throw new ApiError(404, 'Song not found in the playlist');

  await song.destroy();
  return song;
}