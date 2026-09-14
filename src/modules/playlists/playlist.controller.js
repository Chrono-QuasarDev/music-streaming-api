import { createPlaylist } from "./playlist.service.js";

export const playlist = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name } = req.body;
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