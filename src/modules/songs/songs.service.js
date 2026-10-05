import { Op } from "sequelize";
import fs from "fs/promises";
import Song from "../../database/models/songs.model.js";
import User from "../../database/models/user.model.js";
import ArtistProfile from "../../database/models/artistProfile.model.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import { buildPermanentSongPath, fileCleaner, validateAudioFile } from "../../shared/utils/music.utils.js";


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

export const createSong = async (id, songData, stagingPath) => {
  const artistProfile = await ArtistProfile.findOne({ where: { userId: id } });

  if (!artistProfile) {
    await fileCleaner(stagingPath);
    throw new ApiError(404, 'Artist profile not found');
  } 

  let duration;
  try {
    duration = await validateAudioFile(stagingPath);
  } catch (error) {
    await fileCleaner(stagingPath);
    throw new ApiError(422, `Invalid audio file: ${error.message}`);
  }

  const permanentPath = buildPermanentSongPath(stagingPath);
  
  try {
    await fs.rename(stagingPath, permanentPath);

    const song = await Song.create({
      artistId: artistProfile.id,
      title: songData.title,
      albumName: songData.albumName,
      genre: songData.genre,
      trackNumber: songData.trackNumber,
      releaseDate: songData.releaseDate || new Date(),
      durationMs: duration,
      filePath: permanentPath
    });

    song.filePath = undefined;
    return song;
  } catch (error) {
    await fileCleaner(permanentPath);
    
    if (error instanceof ApiError) {
      throw error;
    }

    console.error('Error occurred while creating song:', error);
    throw new ApiError(500, 'Failed to create song');
  }
}