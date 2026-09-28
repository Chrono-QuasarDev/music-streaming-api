import Song from "../../database/models/songs.model.js";
import User from "../../database/models/user.model.js";
import ArtistProfile from "../../database/models/artistProfile.model.js";
import { Op } from "sequelize";


export const getNewReleases = async (query) => {
  // Implementation for fetching new releases
  const THIRTY_DAYS_AGO =  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const { limit, offset, sortBy, orderBy } = query;
  let releases = await Song.findAndCountAll({
    where: {
      releaseDate: {
        [Op.gte]: THIRTY_DAYS_AGO
      }
    }, 
    limit,
    offset,
    order: [[sortBy, orderBy]],
    attributes: { exclude: ['filePath', 'trackNumber', 'createdAt'] },
    include: [{
      model: ArtistProfile,
      attributes: ['id', 'bio', 'profilePictureUrl'],
      include: [{ model: User, attributes: ['id', 'username'] }]
    }]
  });

  return releases;
};