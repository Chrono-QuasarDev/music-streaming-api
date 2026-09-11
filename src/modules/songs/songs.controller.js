import { getSongs, searchSongs, getSongInfo } from "./songs.service.js";

const ALLOWED_SORT_FIELDS = ['title', 'album', 'genre', 'releaseDate'];
const ALLOWED_ORDER = ['asc', 'desc'];

export const songs = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 20;
    const sortBy = ALLOWED_SORT_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : 'releaseDate';
    const orderBy = ALLOWED_ORDER.includes(req.query.orderBy) ? req.query.orderBy : 'desc';

    // Calculate limit and offset
    let limit = size;
    if (limit > 100) limit = 100;
    const offset = (page - 1) * limit;

    const { rows, count } = await getSongs({ limit, offset, sortBy, orderBy });

    res.status(200).json({
      success: true,
      message: 'Songs fetched successfully',
      data: rows,
      meta: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

export const search = async (req, res, next) => {
  try {
    const { q, title, album, genre } = req.query;
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 20;
    const sortBy = ALLOWED_SORT_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : 'releaseDate';
    const orderBy = ALLOWED_ORDER.includes(req.query.orderBy) ? req.query.orderBy : 'desc';

    // Calculate limit and offset
    let limit = size;
    if (limit > 100) limit = 100;
    const offset = (page - 1) * limit;

    const { rows, count } = await searchSongs({ limit, offset, q, title, album, genre, sortBy, orderBy });

    res.status(200).json({
      success: true,
      message: 'Songs searched successfully',
      data: rows,
      meta: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

export const songInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await getSongInfo(id);

    res.status(200).json({
      success: true,
      message: 'Song fetched successfully',
      data: song
    });
  } catch (error) {
    next(error);
  }
}