import { Op } from "sequelize";
import Song from "../../database/models/songs.model.js";

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
  const { limit, offset, q, sortBy, orderBy} = query;
  const where = {};

  if (typeof q === 'string' && q.trim() !== '') {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { albumName: { [Op.iLike]: `%${q}%` } }
    ]
  }

  const songs = Song.findAndCountAll({
    where,
    limit,
    offset
  });
  return songs;
}