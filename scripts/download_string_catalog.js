import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate your JSON catalog and target staging directory
const jsonPath = path.join(__dirname, '../artists_seed_data.json');
const stagingBaseDir = path.join(__dirname, 'music_staging');

function runDownloads() {
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Source dataset JSON file missing at: ${jsonPath}`);
    process.exit(1);
  }

  const artistsCatalog = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`🎵 Starting yt-dlp mass extraction for ${artistsCatalog.length} artist listings...\n`);

  for (const artist of artistsCatalog) {
    for (const album of artist.albums) {
      for (const track of album.tracks) {
        // Resolve absolute target filepath location for the track
        const absoluteOutputPath = path.join(stagingBaseDir, track.local_filename);
        const targetDirectory = path.dirname(absoluteOutputPath);

        // Ensure the nested artist folder structure physically exists locally
        if (!fs.existsSync(targetDirectory)) {
          fs.mkdirSync(targetDirectory, { recursive: true });
        }

        // Avoid downloading a file that was already fetched successfully
        if (fs.existsSync(absoluteOutputPath)) {
          console.log(`⏩ [Skipping] "${artist.name} - ${track.title}" already exists at target location.`);
          continue;
        }

        console.log(`📥 [Downloading] "${artist.name} - ${track.title}"...`);

        // Construct a precise YouTube search query string
        const searchQuery = `ytsearch1:${artist.name} ${track.title} official audio`;

        // Configure yt-dlp to extract 128kbps MP3 audio streams efficiently
        const ytdlpCommand = [
          'yt-dlp',
          `"${searchQuery}"`,
          '-x',
          '--audio-format mp3',
          '--audio-quality 128K',
          // Force yt-dlp to output exactly to your target path location
          `-o "${absoluteOutputPath.replace('.mp3', '.%(ext)s')}"`,
          '--no-playlist',
          '--quiet'
        ].join(' ');

        try {
          execSync(ytdlpCommand, { stdio: 'inherit' });
          console.log(`✅ [Success] Saved straight to: ${track.local_filename}\n`);
        } catch (error) {
          console.error(`❌ [Failed] Could not process entry "${artist.name} - ${track.title}":`, error.message);
        }
      }
    }
  }

  console.log('🚀 Mass staging synchronization completed.');
}

runDownloads();
