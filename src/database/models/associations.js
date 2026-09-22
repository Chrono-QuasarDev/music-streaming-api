import User from "./user.model.js";
import ArtistProfile from "./artistProfile.model.js";
import Song from "./songs.model.js";
import PlaylistSong from "./playlistSongs.model.js";
import Playlist from "./playlist.model.js";
import Follows from "./follows.model.js";

User.hasOne(ArtistProfile, { foreignKey: "userId" });
ArtistProfile.belongsTo(User, { foreignKey: "userId" });

ArtistProfile.hasMany(Song, { foreignKey: "artistId" });
Song.belongsTo(ArtistProfile, { foreignKey: "artistId" });

User.hasMany(Playlist, { foreignKey: "userId" });
Playlist.belongsTo(User, { foreignKey: "userId" });

Playlist.belongsToMany(Song, {
  as: 'songs',
  through: PlaylistSong,
  foreignKey: "playlistId",
  otherKey: "songId"
});
Song.belongsToMany(Playlist, {
  as: 'playlists',
  through: PlaylistSong,
  foreignKey: "songId",
  otherKey: "playlistId"
});

User.belongsToMany(ArtistProfile, {
  as: 'FollowedArtists',
  through: Follows,
  foreignKey: "followerId",
  otherKey: "artistId"
});
ArtistProfile.belongsToMany(User, {
  as: 'Follower',
  through: Follows,
  foreignKey: "artistId",
  otherKey: "followerId"
});