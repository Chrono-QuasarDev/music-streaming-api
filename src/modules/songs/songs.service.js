import { Op } from "sequelize";
import Song from "../../database/models/songs.model.js";
import User from "../../database/models/user.model.js";
import ArtistProfile from "../../database/models/artistProfile.model.js";
import { ApiError } from "../../shared/utils/ApiError.js";

export const getSongs = async (query) => {
  const { limit, offset, sortBy, orderBy } = query;
  const songs = Song.findAndCountAll({
    limit,
    offset,
    order: [[sortBy, orderBy]]
  });
  return songs;
}

export const searchSongs = async (query) => {
  const { title, album, genre, limit, offset, q, sortBy, orderBy} = query;
  const where = {};

  if (typeof q === 'string' && q.trim() !== '') {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { albumName: { [Op.iLike]: `%${q}%` } },
    ]
  }

  if (title) where.title = { [Op.iLike]: `%${title}%` };
  if (album) where.albumName = { [Op.iLike]: `%${album}%` };
  if (genre) where.genre = { [Op.iLike]: `%${genre}%` };

  const songs = Song.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortBy, orderBy]]
  });
  return songs;
}

export const getSongInfo = async (id) => {
  const song = await Song.findByPk(id, {
    include: [
      {
        model: ArtistProfile,
        include: [{ model: User, attributes: ['username'] }]
      }
    ]
  });
  if (!song) {
    throw new ApiError(404, 'Song not found');
  }

  return song;
}