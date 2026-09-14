import { getSongs, searchSongs, getSongInfo, getSongFilePath } from "./songs.service.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import fs from "fs/promises";
import path from "path";
import { parseRange } from "../../shared/utils/parseRange.js";
import { createReadStream } from "fs";

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

export const stream = async (req, res, next) => {
  try {
    // Find the song file in the server
    const filePath = await getSongFilePath(req.params.id);

    // Get the file info
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;

    // Check if the browser sent a range header
    const rangeHeader = req.headers.range;
    const range = parseRange(rangeHeader, fileSize);

    if (range.type === 'unsatisfiable') {
      res.writeHead(416, {
        'Content-Range': `bytes */${fileSize}`,
        'Accept-Ranges': 'bytes'
      });
      return res.end();
    }

    if (range.type === 'partial') {
      // ----- BROWSER NEEDS A SPECIFIC PIECE

      const { start, end } = range;

      // Calculate the size of the chunk
      const chunkSize = (end - start) + 1;

      // Add everything to the response
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg'
      });

      const stream = createReadStream(filePath, { start, end });
      stream.on('error', (err) => {
        console.error('Error occurred while reading file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end();
      });
      return stream.pipe(res);
    }

    // ----- BROWSER WANTS THE WHOLE FILE -----
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg'
    });

    // Stream the song
    const stream = createReadStream(filePath);
    stream.on('error', (err) => {
      console.error('Error occurred while reading file:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end();
    });
    return stream.pipe(res);
  } catch (error) {
    next(error);
  }
}