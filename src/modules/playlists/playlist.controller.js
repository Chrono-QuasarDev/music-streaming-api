import { createPlaylist, getPlaylistInfo, getAllPlaylists } from "./playlist.service.js";
import { createPlaylistSchema } from "./playlist.validator.js";

export const playlist = async (req, res, next) => {
  try {
    const { id } = req.user;
    const name = createPlaylistSchema.parse(req.body);

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

export const getPlaylist = async (req, res, next) => {
  try {
    const playlistId = req.params.id;
    const playlist = await getPlaylistInfo(playlistId);

    return res.status(200).json({
      success: true,
      message: 'Playlist info',
      data: playlist
    });
  } catch (error) {
    next(error);
  }
}