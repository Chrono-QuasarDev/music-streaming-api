import { randomUUID } from "node:crypto";
import "dotenv/config";
import sequelize from "../../config/sequelize.js";
import Playlist from "../models/playlist.model.js";
import PlaylistSong from "../models/playlistSongs.model.js";
import Song from "../models/songs.model.js";

const PLAYLIST_NAME = "Mood Lifter";

const SONG_PATHS = [
  "spolist/01_Life_Story_SpotiDost.mp3",
  "spolist/02_Silence_SpotiDost.mp3",
  "spolist/03_Milarrochy_Bay_SpotiDost.mp3",
  "spolist/04_Highland_Girl_SpotiDost.mp3",
  "spolist/05_Leave_Her_Johnny_SpotiDost.mp3",
  "spolist/06_Ring_Ding_A_Scotsmans_Story_SpotiDost.mp3"
];

export async function up() {
  const base = Date.now();

  const playlist = await Playlist.findOne({ where: { name: PLAYLIST_NAME } });
  if (!playlist) {
    throw new Error(`Playlist not found: ${PLAYLIST_NAME}. Create it before running this seeder.`);
  }

  const songs = [];
  for (const filePath of SONG_PATHS) {
    const song = await Song.findOne({ where: { filePath } });
    if (!song) {
      throw new Error(`Song not found: ${filePath}. Run the songs seeder first.`);
    }
    songs.push(song);
  }

  for (const [index, song] of songs.entries()) {
    await PlaylistSong.findOrCreate({
      where: { playlistId: playlist.id, songId: song.id },
      defaults: {
        id: randomUUID(),
        addedAt: new Date(base + index * 60_000)
      }
    });
  }
}

export async function down() {
  const playlist = await Playlist.findOne({ where: { name: PLAYLIST_NAME } });
  if (playlist) {
    await PlaylistSong.destroy({ where: { playlistId: playlist.id } });
  }
}