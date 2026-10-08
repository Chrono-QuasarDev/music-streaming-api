import { Op } from "sequelize";
import Song from "../../database/models/songs.model.js";
import User from "../../database/models/user.model.js";
import ArtistProfile from "../../database/models/artistProfile.model.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import { validateAudioFile } from "../../shared/utils/music.utils.js";
import { deleteFileFromB2, uploadFileToB2 } from "../../shared/middleware/aws.upload.js";


export const getSongs = async (query) => {
  const { limit, offset, sortBy, orderBy } = query;
  const songs = Song.findAndCountAll({
    limit,
    offset,
    order: [[sortBy, orderBy]],
    attributes: ['id', 'title', 'artistId', 'albumName', 'genre'],
    include: [{
      model: ArtistProfile,
      attributes: ['id', 'bio', 'profilePictureUrl'],
      include: [{ model: User, attributes: ['id', 'username'] }]
    }]
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
    order: [[sortBy, orderBy]],
    include: [{
      model: ArtistProfile,
      attributes: ['id', 'bio', 'profilePictureUrl'],
      include: [{ model: User, attributes: ['id', 'username'] }]
    }]
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

export const getSongFilePath = async (id) => {
  const song = await Song.findByPk(id);
  if (!song) throw new ApiError(404, 'Song not found');

  const filePath = song.filePath;

  return filePath;
}

export const shareSong = async (id) => {
  const song = await Song.findByPk(id, {
    attributes: ['id', 'title', 'albumName'],
    include: [{
      model: ArtistProfile,
      attributes: { exclude: ['userId', 'profilePictureUrl', 'createdAt', 'updatedAt'] },
      include: [{ model: User, attributes: ['username'] }]
    }]
  });
  if (!song) throw new ApiError(404, 'Song not found');

  return song;
}

export const createSong = async (id, songData, file) => {
  const artistProfile = await ArtistProfile.findOne({ where: { userId: id } });
  if (!artistProfile) {
    throw new ApiError(404, 'Artist profile not found');
  } 

  const duration = await validateAudioFile(file);
  // TODO: Add a unique constraint on (artistId, title)

  const fileKey = await uploadFileToB2(file, artistProfile.id);
  try {
    const song = await Song.create({
      artistId: artistProfile.id,
      ...songData,
      durationMs: duration,
      filePath: fileKey
    });
    
    const { filePath, ...safeSong } = song.toJSON();
    return safeSong;
  } catch (error) {
    await deleteFileFromB2(fileKey).catch((err) => console.error('B2 cleanup failed', err));

    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError(409, 'A song with this title already exists for this artist');
    }

    throw new ApiError(500, 'Failed to create song');
  }
}