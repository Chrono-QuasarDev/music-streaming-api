import { getNewReleases } from "./discovery.service.js";

const ALLOWED_SORT_FIELDS = ['title', 'albumName', 'genre', 'releaseDate'];
const ALLOWED_ORDER = ['asc', 'desc'];

export const newReleases = async (req, res, next) => {
  try {
    // Implementation for fetching new releases
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const sortBy = ALLOWED_SORT_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : 'releaseDate';
    const orderBy = ALLOWED_ORDER.includes(req.query.orderBy) ? req.query.orderBy : 'desc';

    let limit = size;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;
    let offset = (page - 1) * limit;

    const { rows, count } = await getNewReleases({ limit, offset, sortBy, orderBy });

    res.status(200).json({
      success: true,
      message: 'New releases fetched successfully',
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