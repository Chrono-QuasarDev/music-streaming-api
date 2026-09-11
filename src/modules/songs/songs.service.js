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