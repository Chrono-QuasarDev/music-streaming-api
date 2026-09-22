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
    attributes: { exclude: ['userId', 'createdAt'] }
  });
  if (!artist) throw new ApiError(404, "Artist not found");

  return artist;
}

export const followArtist = async (artistId, userId) => {
  const isArtist = await ArtistProfile.findByPk(artistId);
  if (!isArtist) throw new ApiError(404, "Artist not found");

  if (isArtist.userId === userId) throw new ApiError(400, "You cannot follow yourself");

  let follows;
  let created;

  try {
    [follows, created] = await Follows.findOrCreate({
      where: {
        artistId,
        followerId: userId
      }
    });
  } catch (error) {
    throw new ApiError(500, "Error following artist");
  }

  if (!created) throw new ApiError(400, "You are already following this artist");

  return follows;
}