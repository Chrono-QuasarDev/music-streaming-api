import { getSongs, searchSongs, getSongInfo } from "./songs.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    console.log('📢 Streaming request received! Range:', req.headers.range);

    // Find the song file in the server
    const filePath = path.join(__dirname, '../../../spolist', '51_GANG4GANG_SpotiDost.mp3');
    console.log('📁 Looking for file at:', filePath);

    // Get the file info
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    // Check if the browser sent a range header
    const range = req.headers.range;

    if (range) {
      // ----- BROWSER NEEDS A SPECIFIC PIECE

      // Parse the range
      const parts = range.replace('bytes=', '').split('-');
      const start = parseInt(parts[0]);
      const end = parts[1] ? parseInt(parts[1]) : fileSize - 1;

      // Calculate the size of the chunk
      const chunkSize = (end - start) + 1;

      // Add everything to the response
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg'
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      // ----- BROWSER WANTS THE WHOLE FILE -----

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg'
      });

      // Stream the song
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
  } catch (error) {
    next(error);
  }
}