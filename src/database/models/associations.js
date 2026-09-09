import User from "./user.model.js";
import ArtistProfile from "./artistProfile.model.js";
import Song from "./songs.model.js";
import PlaylistSong from "./playlistSongs.model.js";
import Playlist from "./playlist.model.js";
import Follows from "./follows.model.js";

User.hasOne(ArtistProfile, { foreignKey: "user_id" });
ArtistProfile.belongsTo(User, { foreignKey: "user_id" });

ArtistProfile.hasMany(Song, { foreignKey: "artist_id" });
Song.belongsTo(ArtistProfile, { foreignKey: "artist_id" });

User.hasMany(Playlist, { foreignKey: "user_id" });
Playlist.belongsTo(User, { foreignKey: "user_id" });

Playlist.belongsToMany(Song, {
  through: PlaylistSong,
  foreignKey: "playlist_id",
  otherKey: "song_id"
});
Song.belongsToMany(Playlist, {
  through: PlaylistSong,
  foreignKey: "song_id",
  otherKey: "playlist_id"
});

User.belongsToMany(User, {
  as: 'Artist',
  through: Follows,
  foreignKey: "artist_id",
  otherKey: "follower_id"
});
User.belongsToMany(User, {
  as: 'Follower',
  through: Follows,
  foreignKey: "follower_id",
  otherKey: "artist_id"
});