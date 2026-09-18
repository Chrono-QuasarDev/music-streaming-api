import { ApiError } from "../utils/ApiError.js";
import Playlist from "../../database/models/playlist.model.js";

export const authorize = async (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized');
      }
  
      if (!roles.includes(req.user.role)) {
        throw new ApiError(403, 'Forbidden');
      }
  
      next();
    } catch (error) {
      next(error);
    }
  }
}

export const authorizePlaylistOwner = async (req, res, next) => {
  try {
    const playlist = await Playlist.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      }
    });

    if (!playlist) {
      throw new ApiError(404, 'Playlist not found');
    }

    req.playlist = playlist;
    next();
  } catch (error) {
    next(error);
  }
}