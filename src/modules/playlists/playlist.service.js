import { where } from "sequelize";
import Playlist from "../../database/models/playlist.model.js";
import PlaylistSong from "../../database/models/playlistSongs.model.js";
import Song from "../../database/models/songs.model.js";
import { ApiError } from "../../shared/utils/ApiError.js";

export const createPlaylist = async (id, name) => {
  const isExits = await Playlist.findOne({ where: { id, name } });
  if (isExits) throw new ApiError(400, 'Playlist name already exists');

  const playlist = await Playlist.create({
    userId: id,
    name
  });

  return playlist;
}

export const getAllPlaylists = async (id) => {
  const playlists = await Playlist.findAll({
    where: { userId: id },
    attributes: ['id', 'userId', 'name']
  });
  return playlists;
}

export const getPlaylistInfo = async (id) => {
  const playlist = await Playlist.findByPk(id, {
    attributes: ['id', 'name'],
    include: [
      { 
        model: Song, as: 'songs',
        attributes: ['id', 'title', 'artistId', 'durationMs', 'genre', 'releaseDate'],
        through: { attributes: [], },
      }
    ],
    order: [[{ model: Song, as: 'songs' }, PlaylistSong, 'addedAt', 'ASC']]
  });

  if (!playlist) throw new ApiError(404, 'Playlist not found');

  return playlist;
}

export const playlistUpdate = async (playlist, name) => {
  const playlistName = await Playlist.findOne({ where: { name } });
  if (playlistName) throw new ApiError(400, 'Playlist name already exists');

  await playlist.update({ name });

  return playlist;
}

export const playlistDelete = async (playlistData) => {
  const playlist = await Playlist.destroy({ where: { id: playlistData.id }});

  return playlist;
}

export const addSong = async (playlistId, songId) => {
  const [ playlistSong, created ] = await PlaylistSong.findOrCreate({
    where: {
      playlistId,
      songId
    }
  });

  if (!created) throw new ApiError(400, 'Song is already in the playlist');

  return playlistSong;
}