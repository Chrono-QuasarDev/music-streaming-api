import Songs from "../../database/models/songs.model.js";
import User from "../../database/models/user.model.js";
import ArtistProfile from "../../database/models/artistProfile.model.js";
import { ApiError } from "../../shared/utils/ApiError.js";

export const getArtist = async (id) => {
  const artist = await ArtistProfile.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ['username']
      },
      { 
        model: Songs,
        attributes: { exclude: ['id', 'artistId', 'filePath','createdAt'] }
      }
    ],
    attributes: ['bio']
  });
  if (!artist) throw new ApiError(404, "Artist not found");

  return artist;
}