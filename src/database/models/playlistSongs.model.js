import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const PlaylistSong = sequelize.define("PlaylistSong", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  playlist_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'playlist_id',
  },
  songId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'song_id',
  },
  addedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'added_at',
  }
},
{
  tableName: 'playlist_songs',
  freezeTableName: true,
  timestamps: false
});

export default PlaylistSong;