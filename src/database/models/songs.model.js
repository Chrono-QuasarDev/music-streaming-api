import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Song = sequelize.define("Song", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  artist_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  albumName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'album_name'
  },
  trackNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'track_number'
  },
  durationMs: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'duration_ms'
  },
  filePath: {
    type: DataTypes.STRING(2048),
    allowNull: false,
    field: 'file_path'
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'release_date'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'
  }
}, 
{
  tableName: 'songs',
  freezeTableName: true,
  timestamps: false
});

export default Song;