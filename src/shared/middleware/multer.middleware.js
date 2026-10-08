import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
  'audio/aac',
  'audio/mp3',
  'audio/x-m4a'
];

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (AUDIO_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(`Invalid file type "${file.mimetype}". Only audio files are allowed`));
    }
  },
});

export const uploadAudio = (req, res, next) => 
  multerUpload.single('audio')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      return next(new ApiError(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400, err.message));
    }
    next(err);
  }
)