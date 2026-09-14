import "dotenv/config";
import { randomUUID } from "node:crypto";
import sequelize from "../../config/sequelize.js";
import User from "../models/user.model.js";
import ArtistProfile from "../models/artistProfile.model.js";
import Song from "../models/songs.model.js";

const albumName = "SpotiDost Collection";
const durationMs = 180000;
const releaseDate = new Date("2026-01-01");

const songGroups = [
  {
    artist: "the_longest_johns",
    genre: "Folk",
    files: [
      "01_Life_Story_SpotiDost.mp3",
      "02_Silence_SpotiDost.mp3",
      "03_Milarrochy_Bay_SpotiDost.mp3",
      "04_Highland_Girl_SpotiDost.mp3",
      "05_Leave_Her_Johnny_SpotiDost.mp3",
      "06_Ring_Ding_A_Scotsmans_Story_SpotiDost.mp3",
      "07_Bones_SpotiDost.mp3",
      "08_Home_SpotiDost.mp3"
    ]
  },
  {
    artist: "ella_henderson",
    genre: "Pop",
    files: ["09_Carry_You_Home_feat._Ella_Henderson_SpotiDost.mp3"]
  },
  {
    artist: "walk_off_the_earth",
    genre: "Pop",
    files: ["11_My_Stupid_Heart_SpotiDost.mp3"]
  },
  {
    artist: "eve",
    genre: "Hip-Hop",
    files: ["13_Immortal_Queen_feat._Chaka_Khan_Eve_SpotiDost.mp3"]
  },
  {
    artist: "vaultboy",
    genre: "Alternative Pop",
    files: ["14_everything_sucks_SpotiDost.mp3"]
  },
  {
    artist: "lil_durk",
    genre: "Hip-Hop",
    files: ["15_Star_Song_feat._Lil_Durk_SpotiDost.mp3"]
  },
  {
    artist: "iann_dior",
    genre: "Hip-Hop",
    files: ["26_Mood_feat._iann_dior_SpotiDost.mp3"]
  },
  {
    artist: "tion_wayne",
    genre: "UK Rap",
    files: ["29_Night_Away_Dance_feat._Tion_Wayne_SpotiDost.mp3"]
  },
  {
    artist: "nemzzz",
    genre: "UK Rap",
    files: ["30_Dont_Lie_feat._Nemzzz_SpotiDost.mp3"]
  },
  {
    artist: "lil_tecca",
    genre: "Hip-Hop",
    files: ["39_Ransom_SpotiDost.mp3"]
  },
  {
    artist: "juice_wrld",
    genre: "Hip-Hop",
    files: [
      "41_Lucid_Dreams_SpotiDost.mp3",
      "44_Wishing_Well_SpotiDost.mp3",
      "46_Graduation_with_Juice_WRLD_SpotiDost.mp3",
      "47_DONT_WANT_IT_SpotiDost.mp3",
      "48_Heavy_SpotiDost.mp3"
    ]
  },
  {
    artist: "lil_uzi_vert",
    genre: "Hip-Hop",
    files: ["51_GANG4GANG_SpotiDost.mp3"]
  },
  {
    artist: "khalid",
    genre: "R&B",
    files: ["56_Young_Dumb_Broke_SpotiDost.mp3"]
  },
  {
    artist: "omi",
    genre: "Pop",
    files: ["55_Cheerleader_SpotiDost.mp3"]
  },
  {
    artist: "roddy_ricch",
    genre: "Hip-Hop",
    files: ["60_The_Box_SpotiDost.mp3"]
  },
  {
    artist: "spotidost_anime",
    genre: "Anime",
    files: [
      "22_Asta_Uk_Drill_Black_Clover_Rap_SpotiDost.mp3",
      "23_Bachira_Meguru_Brazillian_Funk_Blue_Lock_UK_Rap_SpotiDost.mp3",
      "27_Lilo_Stitch_SpotiDost.mp3",
      "28_Maze_Runner_SpotiDost.mp3"
    ]
  },
  {
    artist: "spotidost_viking",
    genre: "Viking",
    files: [
      "31_FROZEN_GODS_SpotiDost.mp3",
      "32_Voices_in_the_World_SpotiDost.mp3",
      "33_VALHALLA_CALLING_SpotiDost.mp3",
      "34_VALHALLA_CALLING_PT._2_SpotiDost.mp3",
      "35_Viking_Vibes_SpotiDost.mp3",
      "36_Viking_Mother_SpotiDost.mp3",
      "37_Dragons_Lair_SpotiDost.mp3",
      "38_Fijord_Moonlight_SpotiDost.mp3"
    ]
  },
  {
    artist: "spotidost_curated",
    genre: "Electronic",
    files: [
      "10_Spirit_In_The_Sky_SpotiDost.mp3",
      "12_Spinnin_SpotiDost.mp3",
      "16_Who_Am_II_Dont_Know_SpotiDost.mp3",
      "17_Afraid_Of_Love_SpotiDost.mp3",
      "18_Better_With_You_Than_On_My_Own_SpotiDost.mp3",
      "19_Amor_Na_Praia_-_Slowed_SpotiDost.mp3",
      "20_Falling_SpotiDost.mp3",
      "21_NEVER_FALL_IN_LOVE_SpotiDost.mp3",
      "24_The_Kings_Affirmation_SpotiDost.mp3",
      "25_Moves_SpotiDost.mp3",
      "40_NOW_OR_NEVER_SpotiDost.mp3",
      "42_Fly_N_Ghetto_SpotiDost.mp3",
      "43_Noticed_SpotiDost.mp3",
      "45_Monopoly_SpotiDost.mp3",
      "49_Pices_SpotiDost.mp3",
      "50_Thick_Of_It_feat._Trippie_Redd_SpotiDost.mp3",
      "52_Angels_Shine_Bright_SpotiDost.mp3",
      "53_DTH_SpotiDost.mp3",
      "54_The_Ones_We_Lost_SpotiDost.mp3",
      "57_Die_Young_SpotiDost.mp3",
      "58_Had_To_Leave_SpotiDost.mp3",
      "59_Fall_Back_SpotiDost.mp3",
      "lin-manuel_miranda_opetaia_foa_i_we_know_the_way_from_moana_mp3_79941.mp3"
    ]
  }
];

const songs = songGroups.flatMap(({ artist, genre, files }) =>
  files.map((filename) => ({ artist, genre, filename }))
);

function getTrackNumber(filename) {
  const match = filename.match(/^(\d+)_/);
  return match ? Number(match[1]) : songs.length;
}

function getTitle(filename) {
  if (filename.startsWith("lin-manuel_")) {
    return "We Know the Way from Moana";
  }

  return filename
    .replace(/^\d+_/, "")
    .replace(/_SpotiDost\.mp3$/, "")
    .replaceAll("_", " ");
}

async function seedSongs() {
  let inserted = 0;

  await sequelize.transaction(async (transaction) => {
    const profileIds = new Map();

    for (const artistUsername of new Set(songs.map((song) => song.artist))) {
      const user = await User.findOne({
        where: { username: artistUsername },
        transaction
      });

      if (!user) {
        throw new Error(`Artist user not found: ${artistUsername}. Run npm run seed:artists first.`);
      }

      const profile = await ArtistProfile.findOne({
        where: { userId: user.id },
        transaction
      });

      if (!profile) {
        throw new Error(`Artist profile not found for: ${artistUsername}. Run npm run seed:artists first.`);
      }

      profileIds.set(artistUsername, profile.id);
    }

    for (const song of songs) {
      const filePath = `spolist/${song.filename}`;
      const [songRecord, wasCreated] = await Song.findOrCreate({
        where: { filePath },
        defaults: {
          id: randomUUID(),
          title: getTitle(song.filename),
          artistId: profileIds.get(song.artist),
          albumName,
          trackNumber: getTrackNumber(song.filename),
          durationMs,
          filePath,
          genre: song.genre,
          releaseDate,
          createdAt: new Date()
        },
        transaction
      });

      if (wasCreated) {
        inserted += 1;
      }
    }
  });

  console.log(`Seeded ${inserted} songs (${songs.length} catalog entries checked).`);
}

seedSongs()
  .catch((error) => {
    console.error("Song seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });