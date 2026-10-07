import { parseBuffer } from "music-metadata";
import { ApiError } from "./ApiError.js";

const SUPPORTED = [
  { container: /^MPEG$/,       codec: /LAYER 3/ },
  { container: /^WAVE?$/,      codec: /^(PCM|ADPCM)/ },
  { container: /^FLAC$/,       codec: /^FLAC/ },
  { container: /^(ADTS|AAC)/,  codec: /AAC/ },
  { container: /^(M4A|MP4)/,   codec: /AAC/ },
  { container: /^OGG$/,        codec: /^(VORBIS|OPUS|FLAC)/ },
];

export async function validateAudioFile(file) {
  let format;
  try {
    ({ format } = await parseBuffer(file.buffer, { mimeType: file.mimetype}, { duration: true }));
  } catch (err) {
    console.error('music-metadata failed:', err);
    throw new ApiError(400, 'Could not read audio file');
  }
  
  const container = String(format.container ?? '').toUpperCase();
  const codec = String(format.codec ?? '').toUpperCase();

  const ok = SUPPORTED.some((f) => f.container.test(container) && f.codec.test(codec));
  if (!ok) throw new ApiError(415, `Unsupported audio format: ${container}/${codec}`);

  if (!format.duration) throw new ApiError(400, 'Could not determine audio duration');
  return Math.round(format.duration * 1000);
}