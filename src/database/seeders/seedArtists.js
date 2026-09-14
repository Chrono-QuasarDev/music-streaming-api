import "dotenv/config";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import sequelize from "../../config/sequelize.js";
import User from "../models/user.model.js";
import ArtistProfile from "../models/artistProfile.model.js";

const defaultPassword = process.env.SEED_ARTIST_PASSWORD || "change-me-before-production";

const artists = [
  ["the_longest_johns", "the.longest.johns@spotidost.local", "The Longest Johns", "Traditional folk and sea shanty performances."],
  ["walk_off_the_earth", "walk.off.the.earth@spotidost.local", "Walk Off the Earth", "Pop and alternative recordings."],
  ["ella_henderson", "ella.henderson@spotidost.local", "Ella Henderson", "Pop vocal recordings."],
  ["chaka_khan", "chaka.khan@spotidost.local", "Chaka Khan", "Soul and R&B recordings."],
  ["eve", "eve@spotidost.local", "Eve", "Hip-hop recordings."],
  ["vaultboy", "vaultboy@spotidost.local", "vaultboy", "Alternative pop recordings."],
  ["lil_durk", "lil.durk@spotidost.local", "Lil Durk", "Hip-hop recordings."],
  ["iann_dior", "iann.dior@spotidost.local", "iann dior", "Melodic hip-hop and pop recordings."],
  ["tion_wayne", "tion.wayne@spotidost.local", "Tion Wayne", "UK hip-hop recordings."],
  ["nemzzz", "nemzzz@spotidost.local", "Nemzzz", "UK rap recordings."],
  ["lil_tecca", "lil.tecca@spotidost.local", "Lil Tecca", "Hip-hop recordings."],
  ["juice_wrld", "juice.wrld@spotidost.local", "Juice WRLD", "Melodic hip-hop recordings."],
  ["lil_uzi_vert", "lil.uzi.vert@spotidost.local", "Lil Uzi Vert", "Hip-hop recordings."],
  ["khalid", "khalid@spotidost.local", "Khalid", "R&B and pop recordings."],
  ["omi", "omi@spotidost.local", "OMI", "Pop recordings."],
  ["roddy_ricch", "roddy.ricch@spotidost.local", "Roddy Ricch", "Hip-hop recordings."],
  ["spotidost_folk", "spotidost.folk@spotidost.local", "SpotiDost Folk Collective", "Curated folk and acoustic recordings."],
  ["spotidost_anime", "spotidost.anime@spotidost.local", "SpotiDost Anime Collective", "Curated anime and gaming-inspired recordings."],
  ["spotidost_viking", "spotidost.viking@spotidost.local", "SpotiDost Viking Collective", "Curated Nordic and Viking-inspired recordings."],
  ["spotidost_curated", "spotidost.curated@spotidost.local", "SpotiDost Curated", "Curated tracks whose original artist is not present in the filenames."]
];

async function seedArtists() {
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  await sequelize.transaction(async (transaction) => {
    for (const [username, email, displayName, bio] of artists) {
      const [user] = await User.findOrCreate({
        where: { username },
        defaults: {
          id: randomUUID(),
          email,
          passwordHash,
          role: "artist"
        },
        transaction
      });

      if (user.role !== "artist") {
        await user.update({ role: "artist" }, { transaction });
      }

      await ArtistProfile.findOrCreate({
        where: { userId: user.id },
        defaults: {
          id: randomUUID(),
          userId: user.id,
          bio: `${displayName}: ${bio}`,
          profilePictureUrl: `https://picsum.photos/seed/${username}/512/512`,
          createdAt: new Date()
        },
        transaction
      });
    }
  });

  console.log(`Seeded ${artists.length} artist users and profiles.`);
}

seedArtists()
  .catch((error) => {
    console.error("Artist seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });