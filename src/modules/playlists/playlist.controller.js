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
export const playlist = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name } = createPlaylistSchema.parse(req.body);

    const playlist = await createPlaylist(id, name);

    return res.status(201).json({
      success: true,
      message: 'Playlist created successfully',
      data: playlist
    }); 
  } catch (error) {
    next(error);
  }
}

// Get all playlists for the current user
export const allPlaylists = async (req, res, next) => {
  try {
    const { id } = req.user;
    const playlists = await getAllPlaylists(id);

    return res.status(200).json({
      success: true,
      message: 'All playlists',
      data: playlists
    })
  } catch (error) {
    next(error);
  }
}

// Get information about a specific playlist
export const getPlaylist = async (req, res, next) => {
  try {
    const { id } = playlistIdSchema.parse(req.params);
    const playlist = await getPlaylistInfo(id);

    return res.status(200).json({
      success: true,
      message: 'Playlist info',
      data: playlist
    });
  } catch (error) {
    next(error);
  }
}

// Update a playlist
export const updatePlaylist = async (req, res,next) => {
  try {
    const { name } = updatePlaylistSchema.parse(req.body);
    const playlist = await playlistUpdate(req.playlist, name);

    return res.status(200).json({
      success: true,
      message: 'Playlist updated successfully',
      data: playlist
    });
  } catch (error) {
    next(error);
  }
}

// Delete a playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await playlistDelete(req.playlist);

    return res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully',
      data: playlist
    });
  } catch (error) {
    next(error);
  }
}

// Add a song to a playlist
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlist } = req;
    const { songId } = songIdSchema.parse(req.body);
    const playlistSong = await addSong(playlist.id, songId);

    return res.status(200).json({
      success: true,
      message: 'Playlist song added successfully',
      data: playlistSong
    });
  } catch (error) {
    next(error);
  }
}

// Remove a song from a playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlist } = req;
    const { songId } = songIdSchema.parse(req.params);
    const song = await removeSong(playlist, songId);

    return res.status(200).json({
      success: true,
      message: 'Playlist song removed successfully',
      data: song
    });
  } catch (error) {
    next(error);
  }
}