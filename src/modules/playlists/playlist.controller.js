import {
  createPlaylist, 
  getPlaylistInfo, 
  getAllPlaylists, 
  playlistUpdate, 
  playlistDelete, 
  addSong, 
  removeSong 
} from "./playlist.service.js";
import {
  createPlaylistSchema, 
  updatePlaylistSchema,
  playlistIdSchema,
  songIdSchema
} from "./playlist.validator.js";

// Create a new playlist
export const playlist = async (req, res) => {
  const { id } = req.user;
  const { name } = createPlaylistSchema.parse(req.body);

  const playlist = await createPlaylist(id, name);

  return res.status(201).json({
    success: true,
    message: 'Playlist created successfully',
    data: playlist
  });
}

// Get all playlists for the current user
export const allPlaylists = async (req, res) => {
  const { id } = req.user;
  const playlists = await getAllPlaylists(id);

  return res.status(200).json({
    success: true,
    message: 'All playlists',
    data: playlists
  })
}

// Get information about a specific playlist
export const getPlaylist = async (req, res) => {
  const { id } = playlistIdSchema.parse(req.params);
  const playlist = await getPlaylistInfo(id);

  return res.status(200).json({
    success: true,
    message: 'Playlist info',
    data: playlist
  });
}

// Update a playlist
export const updatePlaylist = async (req, res) => {
  const { name } = updatePlaylistSchema.parse(req.body);
  const playlist = await playlistUpdate(req.playlist, name);

  return res.status(200).json({
    success: true,
    message: 'Playlist updated successfully',
    data: playlist
  });
}

// Delete a playlist
export const deletePlaylist = async (req, res) => {
  const playlist = await playlistDelete(req.playlist);

  return res.status(200).json({
    success: true,
    message: 'Playlist deleted successfully',
    data: playlist
  });
}

// Add a song to a playlist
export const addSongToPlaylist = async (req, res) => {
  const { playlist } = req;
  const { songId } = songIdSchema.parse(req.body);
  const playlistSong = await addSong(playlist.id, songId);

  return res.status(200).json({
    success: true,
    message: 'Playlist song added successfully',
    data: playlistSong
  });
}

// Remove a song from a playlist
export const removeSongFromPlaylist = async (req, res) => {
  const { playlist } = req;
  const { songId } = songIdSchema.parse(req.params);
  const song = await removeSong(playlist, songId);

  return res.status(200).json({
    success: true,
    message: 'Playlist song removed successfully',
    data: song
  });
}