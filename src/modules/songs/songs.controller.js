import { GetObjectCommand } from "@aws-sdk/client-s3";
import { pipeline } from "stream/promises";
import { s3 } from "../../shared/middleware/aws.upload.js";
import { 
  getSongs, searchSongs, 
  getSongInfo, getSongFilePath, 
  shareSong, createSong
} from "./songs.service.js";
import fs from "fs/promises";
import { parseRange } from "../../shared/utils/parseRange.js";
import { createReadStream } from "fs";
import { songSchema } from "./songs.validator.js";

const ALLOWED_SORT_FIELDS = ['title', 'albumName', 'genre', 'releaseDate'];
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
    const key = await getSongFilePath(req.params.id);

    const data = await s3.send(new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      Range: req.headers.range,
    }));

    res.status(data.ContentRange ? 206 : 200);
    res.set({
      'Content-Type': data.ContentType || 'audio/mpeg',
      'Content-Length': data.ContentLength,
      'Accept-Ranges': 'bytes',
      ...(data.ContentRange && { 'Content-Range': data.ContentRange }),
    });

    await pipeline(data.Body, res);
  } catch (error) {
    if (error?.$metadata?.httpStatusCode === 416) {
      return res.status(416).set('Content-Range', 'bytes */*').end();
    }
    if (res.headersSent) return res.destroy();
    next(error);
  }
}

export const share = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await shareSong(id);

    res.status(200).json({
      success: true,
      message: 'Song shared successfully',
      data: song
    });
  } catch (error) {
    next(error);
  }
}

export const addSong = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided'
      });
    }

    const { title, albumName, genre, trackNumber, releaseDate } = req.body;
    const { id } = req.user;
    const file = req.file;

    const songData = songSchema.parse({
      title,
      albumName,
      genre,
      trackNumber,
      releaseDate
    });

    const song = await createSong(id, songData, file);

    res.status(201).json({
      success: true,
      message: 'Song added successfully',
      data: song,
    });
  } catch (error) {
    next(error);
  }
}