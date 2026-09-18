import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Playlist = sequelize.define("Playlist", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, 
{
  tableName: 'playlists',
  freezeTableName: true,
  timestamps: false
});

export default Playlist;