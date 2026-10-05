import fs from "fs/promises";
import { parseFile } from "music-metadata";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PERMANENT_DIR = path.join(__dirname, "../../..", "spolist");
fs.mkdir(PERMANENT_DIR, { recursive: true }).catch((err) => {
  console.error('Failed to create permanent directory:', err);
});

export async function fileCleaner(path) {
  try {
    await fs.unlink(path)
  } catch (error) {
    console.error('Failed to clean up song file:', error);
  }
}

export async function validateAudioFile(path) {
  const meta = await parseFile(path, { duration: true });
  const { container, codec, duration } = meta.format;

  const normalizedContainer = String(container || '').toUpperCase();
  const normalizedCodec = String(codec || '').toUpperCase();
  const key = `${container}/${codec}`;

  const supportedFormats = {
    'MPEG': ['MPEG 1 LAYER 3', 'MPEG 2 LAYER 3', 'MPEG 2.5 LAYER 3'],
    'WAV': ['PCM', 'ADPCM'],
    'FLAC': ['FLAC'],
    'AAC': ['AAC', 'AAC LC', 'HE-AAC', 'HE-AAC V2'],
    'OGG': ['VORBIS', 'OPUS']
  };

  const normalizedContainerKey = normalizedContainer === 'WAVE' ? 'WAV' : normalizedContainer;
  const acceptedCodecs = supportedFormats[normalizedContainerKey] || [];
  const isSupported = acceptedCodecs.some((supportedCodec) => supportedCodec === normalizedCodec);

  if (!isSupported) {
    throw new Error(`Unsupported audio format: ${key}`);
  }

  return Math.round(duration * 1000);
}

export function buildPermanentSongPath(stagingPath) {
  const extension = path.extname(stagingPath);
  const permanentName = `${crypto.randomUUID()}${extension}`;
  const permanentPath = path.join(PERMANENT_DIR, permanentName);
  return permanentPath;
}