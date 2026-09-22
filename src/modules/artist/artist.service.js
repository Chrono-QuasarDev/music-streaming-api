import Songs from "../../database/models/songs.model.js";
import User from "../../database/models/user.model.js";
import ArtistProfile from "../../database/models/artistProfile.model.js";
import Follows from "../../database/models/follows.model.js"
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

export const followArtist = async (artistId, userId) => {
  const isArtist = await ArtistProfile.findByPk(artistId);
  if (!isArtist) throw new ApiError(404, "Artist not found");

  if (isArtist.userId === userId) throw new ApiError(400, "You cannot follow yourself");

  const isExist = await Follows.findOne({
    where: {
      artistId,
      followerId: userId
    }
  });
  if (isExist) throw new ApiError(400, "You are already following this artist");

  await Follows.create({
    followerId: userId,
    artistId
  });
  return;
}