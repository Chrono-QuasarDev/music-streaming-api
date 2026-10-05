import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STAGING_DIR = path.join(__dirname, "../..", "staging");
fs.mkdirSync(STAGING_DIR, { recursive: true });

const AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
  'audio/aac',
  'audio/mp3',
  'audio/x-m4a'
];

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STAGING_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${crypto.randomUUID()}-${new Date().toISOString().split("T")[0]}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (AUDIO_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type "${file.mimetype}". Only audio files are allowed`));
    }
  },
});