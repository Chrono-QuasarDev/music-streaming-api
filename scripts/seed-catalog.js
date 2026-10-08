import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import bcrypt from 'bcrypt';

// Resolve directory roots under ECMAScript Module mapping
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Initialize DB Models and Connections from your local exports
// Adjust these require path patterns to match where your Sequelize instances reside
import User from '../src/database/models/user.model.js';
import ArtistProfile from '../src/database/models/artistProfile.model.js';
import Song from '../src/database/models/songs.model.js';
import sequelize from '../src/config/sequelize.js';

// 2. Instantiate S3 Client targeting your custom Backblaze B2 endpoint topology
const s3Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT || "https://s3.us-east-005.backblazeb2.com",
  region: "us-east-005", // Extracted automatically from endpoint layout
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
  },
});

const BUCKET_NAME = process.env.B2_BUCKET_NAME || 'api-songs';
const JSON_CATALOG_PATH = path.join(__dirname, '../artists_seed_data.json');
const STAGING_AUDIO_DIR = path.join(__dirname, 'music_staging');

async function executeSeedingPipeline() {
  if (!fs.existsSync(JSON_CATALOG_PATH)) {
    console.error(`❌ Target dataset core JSON profile is missing at: ${JSON_CATALOG_PATH}`);
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(JSON_CATALOG_PATH, 'utf-8'));
  
  // Hash the generic password fallback string beforehand to preserve operational cycles
  const fallbackPasswordString = process.env.SEED_ARTIST_PASSWORD || 'artistpass';
  const globallyHashedPassword = await bcrypt.hash(fallbackPasswordString, 10);

  // Initialize isolation framework to handle atomic relational operations securely
  const dbTransaction = await sequelize.transaction();

  try {
    console.log(`🚀 Starting catalog seeding sequence: Processing ${catalog.length} global artists...\n`);

    for (const artist of catalog) {
      const currentUserId = uuidv4();
      const currentArtistProfileId = uuidv4();

      console.log(`👤 Processing structural entries for target artist: [${artist.name}]`);

      // STEP 1: Fulfill baseline system User specifications
      await User.create({
        id: currentUserId,
        username: artist.username,
        email: artist.email,
        passwordHash: globallyHashedPassword,
        role: 'artist'
      }, { transaction: dbTransaction });

      // STEP 2: Establish the downstream localized Profile relational binding
      await ArtistProfile.create({
        id: currentArtistProfileId,
        userId: currentUserId,
        bio: artist.bio,
        profilePictureUrl: artist.profile_picture_url
      }, { transaction: dbTransaction });

      const tracksToInsert = [];

      for (const album of artist.albums) {
        for (const track of album.tracks) {
          const currentSongId = uuidv4();
          
          // STEP 3: Dynamically enforce your designated B2 directory mapping format
          const targetB2StorageKey = `songs/${currentArtistProfileId}/${currentSongId}-${new Date().toISOString().split('T')[0]}.mp3`;
          
          // Locate local absolute binary staging asset address
          const absoluteLocalFilePath = path.join(STAGING_AUDIO_DIR, track.local_filename);

          if (fs.existsSync(absoluteLocalFilePath)) {
            console.log(`   └── 📦 Streaming local audio object to Cloud storage bucket: ${targetB2StorageKey}`);
            
            const fileBinaryBuffer = fs.readFileSync(absoluteLocalFilePath);

            // Execute the S3 Put object payload transfer straight down to your B2 partition
            await s3Client.send(new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: targetB2StorageKey,
              Body: fileBinaryBuffer,
              ContentType: 'audio/mpeg'
            }));
          } else {
            console.warn(`   └── ⚠️ Local binary component missing at: ${absoluteLocalFilePath}. Defaulting to key tracking reference layout.`);
          }

          // STEP 4: Populate local tracker arrays to feed batch database executions smoothly
          tracksToInsert.push({
            id: currentSongId,
            title: track.title,
            artistId: currentArtistProfileId, // Clean structural mapping anchor
            albumName: album.name,
            trackNumber: track.track_number,
            durationMs: track.duration_ms,
            filePath: targetB2StorageKey, // Corresponds perfectly to your B2 lookup key
            genre: track.genre,
            releaseDate: track.release_date
          });
        }
      }

      // STEP 5: Bulk execute tracks to respect database composite validation constraints cleanly
      if (tracksToInsert.length > 0) {
        await Song.bulkCreate(tracksToInsert, { transaction: dbTransaction });
        console.log(`   ✅ Successfully batch-inserted database tracks for: ${artist.name}\n`);
      }
    }

    // Permanently persist rows across all linked tables if execution blocks evaluate successfully
    await dbTransaction.commit();
    console.log('🎉 Database entries seeded and matching audio data packages successfully synchronized down to Backblaze B2.');

  } catch (error) {
    // Safely discard all relational queries immediately if an upload fails or structural keys collide
    await dbTransaction.rollback();
    console.error('❌ Database seeding and synchronization pipeline aborted due to operational validation failure:');
    console.error(error);
    process.exit(1);
  }
}

executeSeedingPipeline();