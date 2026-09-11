import { getSongs, searchSongs } from "./songs.service.js";

const ALLOWED_SORT_FIELDS = ['title', 'artist', 'releaseDate'];
const ALLOWED_ORDER = ['asc', 'desc'];

export const songs = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;
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
    const q = req.query.q;
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    // Calculate limit and offset
    let limit = size;
    if (limit > 100) limit = 100;
    const offset = (page - 1) * limit;

    const { rows, count } = await searchSongs({ limit, offset, q});
  
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