import Playlist from "../../database/models/playlist.model.js";

export const createPlaylist = async (id, name) => {
  const playlist = Playlist.create({
    userId: id,
    name
  });

  return playlist;
}